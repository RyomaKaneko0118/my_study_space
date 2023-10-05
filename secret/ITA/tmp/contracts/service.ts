import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'

import { LoggerService } from '@src/lib/logger/service'
import { PrismaService } from '@src/lib/prisma/service'

import type {
  CreateContractInput,
  ContractsArgs,
  UpdateContractInput
} from '@src/www/graphql/contracts/dto'

import type { Prisma } from '@prisma/client'

@Injectable()
export class ContractsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService
  ) {}

  async findContractsWithCount(contractsArgs: ContractsArgs) {
    let orderBy: Prisma.ContractOrderByWithRelationInput
    switch (contractsArgs.field) {
      case 'id': {
        orderBy = {
          id: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'start_date': {
        orderBy = {
          dealingStartDate: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'end_date': {
        orderBy = {
          dealingEndDate: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'type': {
        orderBy = {
          contractType: contractsArgs.direction || 'asc'
        }
        break
      }
    }

    const [result, count] = await this.prisma.$transaction([
      this.prisma.contract.findMany({
        orderBy,
        ...contractsArgs.pagination,
        include: {
          customer: true
        }
      }),
      this.prisma.contract.count()
    ])
    return {
      result,
      count
    }
  }

  async findContractById({
    id,
    include
  }: {
    id: number
    include?: Prisma.ContractInclude
  }) {
    const result = await this.prisma.contract.findUnique({
      where: {
        id
      },
      include
    })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async createContract(input: CreateContractInput) {
    try {
      return await this.prisma.contract.create({
        data: {
          ...input
        }
      })
    } catch (e) {
      this.logger.error(e.message)
      throw new InternalServerErrorException()
    }
  }

  async updateContract(input: UpdateContractInput) {
    const specificContract = await this.findContractById({ id: input.id })

    try {
      return await this.prisma.contract.update({
        where: {
          id: specificContract.id
        },
        data: {
          ...input
        }
      })
    } catch (e) {
      this.logger.error(e.message)
      throw new InternalServerErrorException()
    }
  }

  async deleteContract(id: number) {
    await this.findContractById({ id })

    await this.prisma.contract.delete({
      where: {
        id
      }
    })

    return true
  }
}
