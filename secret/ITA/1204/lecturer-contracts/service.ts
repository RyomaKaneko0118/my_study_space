import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'

import { PrismaService } from '@src/lib/prisma/service'

import type {
  CreateLecturerContractInput,
  UpdateLecturerContractInput
} from '@src/www/graphql/lecturer-contracts/dto'

@Injectable()
export class LecturerContractsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO
  // private メソッドに移行するか検討

  async findLecturerContractById(id: number) {
    const result = await this.prisma.lecturerContract.findUnique({
      where: {
        id
      },
      include: {
        lecturer: {
          include: {
            masterLecturerAffiliatedOrganization: true
          }
        }
      }
    })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async createLecturerContract(input: CreateLecturerContractInput) {
    const specificLecturer = await this.prisma.lecturer.findUnique({
      where: {
        id: input.lecturerId
      },
      include: {
        masterLecturerAffiliatedOrganization: true
      }
    })

  
    // NOTE: 講師が存在しない、あるいは既に契約が存在する場合は作成できない
    if (!specificLecturer || specificLecturer.lecturerContract) {
      throw new UnprocessableEntityException()
    }

    // NOTE: 所属組織なしの場合は名義を組織にすることはできない
    if (
      !specificLecturer.masterLecturerAffiliatedOrganization &&
      input.contractorType === 'ORGANIZATION'
    ) {
      throw new UnprocessableEntityException()
    }

    return this.prisma.lecturerContract.create({
      data: input
    })
  }

  async updateLecturerContract(input: UpdateLecturerContractInput) {
    const specificLecturerContract = await this.findLecturerContractById(
      input.id
    )

    // NOTE: 所属組織なしの場合は名義を組織にすることはできない
    if (
      !specificLecturerContract.lecturer.masterLecturerAffiliatedOrganization &&
      input.contractorType === 'ORGANIZATION'
    ) {
      throw new UnprocessableEntityException()
    }

    return await this.prisma.lecturerContract.update({
      where: {
        id: input.id
      },
      data: input
    })
  }
}
