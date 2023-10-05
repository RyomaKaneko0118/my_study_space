import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'

import { LoggerService } from '@src/lib/logger/service'
import { PrismaService } from '@src/lib/prisma/service'
import { StorageService } from '@src/lib/storage/service'

import type {
  CreateContractInput,
  ContractsArgs,
  UpdateContractInput
} from '@src/www/graphql/contracts/dto'

import type { Contract, Prisma } from '@prisma/client'

const ERRORS = {
  BELONG_ORIGIN_AND_HAS_UPDATED: 'BELONG_ORIGIN_AND_HAS_UPDATED',
  STATUS_DOING: 'STATUS_DOING'
}

@Injectable()
export class ContractsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  async findContractsWithCount(contractsArgs: ContractsArgs) {
    const specificCustomer = await this.prisma.customer.findUnique({
      where: {
        id: contractsArgs.customerId
      }
    })
    if (!specificCustomer) {
      throw new NotFoundException()
    }

    let orderBy: Prisma.ContractOrderByWithRelationInput
    switch (contractsArgs.field) {
      case 'id': {
        orderBy = {
          id: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'department': {
        orderBy = {
          departmentId: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'startDate': {
        orderBy = {
          startDate: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'endDate': {
        orderBy = {
          endDate: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'type': {
        orderBy = {
          type: contractsArgs.direction || 'asc'
        }
        break
      }
      case 'status': {
        orderBy = {
          status: contractsArgs.direction || 'asc'
        }
        break
      }
    }

    let where: Prisma.ContractWhereInput
    where = {
      customerId: specificCustomer.id
    }

    if (!contractsArgs.includeOrigin) {
      where = {
        ...where,
        NOT: {
          status: 'UPDATED'
        }
      }
    }

    let result: Contract[]
    let count: number
    await this.prisma.$transaction(async (prisma) => {
      const specificContracts = await prisma.contract.findMany({
        where,
        orderBy,
        ...contractsArgs.pagination,
        include: {
          originContract: true,
          updatedContract: true
        }
      })
      const specificContractsCounts = await prisma.contract.groupBy({
        by: ['customerId'],
        where,
        _count: true
      })
      result = specificContracts
      count =
        specificContractsCounts.length >= 1
          ? specificContractsCounts[0]._count
          : 0
    })

    console.log(result)
    return {
      result,
      count
    }
  }

  async findContractById(id: number) {
    const result = await this.prisma.contract.findUnique({
      where: {
        id
      },
      include: {
        originContract: true,
        updatedContract: true
      }
    })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async createContract(input: CreateContractInput) {
    const { file, ...createContractInput } = input

    let uploadedFile: {
      path: string
      finish: () => void
      reset: () => void
    }
    let filePath: string
    if (file) {
      try {
        const { mimetype, createReadStream } = await file
        uploadedFile = await this.storage.putFile({
          createReadStream,
          mimetype,
          path: 'contracts',
          validate: 'PDF'
        })
        filePath = uploadedFile.path
      } catch (e) {
        this.logger.error(e.message)
        if (uploadedFile) {
          uploadedFile.reset()
        }
        throw new InternalServerErrorException()
      }
    }
    const status = 'DOING'
    try {
      const createdContract = await this.prisma.contract.create({
        data: {
          ...createContractInput,
          filePath,
          status
        },
        include: {
          originContract: true,
          updatedContract: true
        }
      })
      if (uploadedFile) {
        uploadedFile.finish()
      }
      return createdContract
    } catch (e) {
      if (uploadedFile) {
        uploadedFile.reset()
      }
      this.logger.error(e.message)
      throw new InternalServerErrorException()
    }
  }

  async updateContract(input: UpdateContractInput) {
    const specificContract = await this.findContractById(input.id)

    const { file, ...createContractInput } = input

    let uploadedFile: {
      path: string
      finish: () => void
      reset: () => void
    }
    let filePath: string

    if (file) {
      try {
        const { mimetype, createReadStream } = await file
        uploadedFile = await this.storage.putFile({
          createReadStream,
          mimetype,
          path: 'contracts',
          removeFilePath: specificContract.filePath,
          validate: 'PDF'
        })
        filePath = uploadedFile.path
      } catch (e) {
        this.logger.error(e.message)
        if (uploadedFile) {
          uploadedFile.reset()
        }
        throw new InternalServerErrorException()
      }
    }

    try {
      return await this.prisma.contract.update({
        where: {
          id: specificContract.id
        },
        data: {
          ...createContractInput,
          filePath
        },
        include: {
          originContract: true,
          updatedContract: true
        }
      })
    } catch (e) {
      this.logger.error(e.message)
      throw new InternalServerErrorException()
    }
  }

  async deleteContract(id: number) {
    const specificContract = await this.findContractById(id)

    if (specificContract.status === 'DOING') {
      throw new UnprocessableEntityException(ERRORS.STATUS_DOING)
    }
    if (specificContract.originContract && specificContract.updatedContract) {
      throw new UnprocessableEntityException(
        ERRORS.BELONG_ORIGIN_AND_HAS_UPDATED
      )
    }
    await this.prisma.$transaction(async (prisma) => {
      await prisma.contract.delete({
        where: {
          id
        }
      })
      if (specificContract.filePath) {
        this.storage.deleteFile(specificContract.filePath)
      }
    })

    return true
  }
}
