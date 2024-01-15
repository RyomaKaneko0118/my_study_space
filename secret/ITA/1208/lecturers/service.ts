import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException
} from '@nestjs/common'

import { DateService } from '@src/lib/date/service'
import { LoggerService } from '@src/lib/logger/service'
import { PrismaService } from '@src/lib/prisma/service'
import { StorageService } from '@src/lib/storage/service'

import type {
  LecturersArgs,
  CreateLecturerInput,
  UpdateLecturerInput
} from '@src/www/graphql/lecturers/dto'

import type { Prisma } from '@prisma/client'

@Injectable()
export class LecturersService {
  constructor(
    private readonly date: DateService,
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  async findLecturersWithCount({
    saUserId,
    lecturersArgs
  }: {
    saUserId: number
    lecturersArgs: LecturersArgs
  }) {
    let orderBy: Prisma.LecturerOrderByWithRelationInput
    if (lecturersArgs.field) {
      orderBy = {
        [lecturersArgs.field]: lecturersArgs.direction || 'asc'
      }
    }

    let where: Prisma.LecturerWhereInput

    if (lecturersArgs.name) {
      where = {
        ...where,
        AND: {
          OR: [
            {
              firstName: {
                contains: lecturersArgs.name
              }
            },
            {
              firstNameKana: {
                contains: lecturersArgs.name
              }
            },
            {
              lastName: {
                contains: lecturersArgs.name
              }
            },
            {
              lastNameKana: {
                contains: lecturersArgs.name
              }
            },
            {
              businessName: {
                contains: lecturersArgs.name
              }
            },
            {
              bussinessNameKana: {
                contains: lecturersArgs.name
              }
            }
          ]
        }
      }
    }

    if (lecturersArgs.masterLecturerCategoryId) {
      where = {
        ...where,
        masterLecturerCategories: {
          some: {
            id: lecturersArgs.masterLecturerCategoryId
          }
        }
      }
    }

    if (lecturersArgs.pinnedOnly) {
      where = {
        ...where,
        lecturerPins: {
          some: {
            saUserId
          }
        }
      }
    }

    if (!lecturersArgs.includeArchived) {
      where = {
        ...where,
        archived: false
      }
    }

    const [result, count] = await this.prisma.$transaction([
      this.prisma.lecturer.findMany({
        where,
        orderBy,
        ...lecturersArgs.pagination,
        include: {
          lecturerContract: true,
          lecturerPins: {
            where: {
              saUserId
            }
          },
          masterLecturerCategories: {
            orderBy: {
              id: 'asc'
            }
          }
        }
      }),
      this.prisma.lecturer.count({ where })
    ])
    return {
      result,
      count
    }
  }

  async findLecturerById({
    id,
    include
  }: {
    id: number
    include?: Prisma.LecturerInclude
  }) {
    const result = await this.prisma.lecturer.findUnique({
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

  async createLecturer({
    input,
    include
  }: {
    input: CreateLecturerInput
    include?: Prisma.LecturerInclude
  }) {
    const {
      image,
      createLecturerContactInputs,
      createLecturerEmergencyContactInputs,
      connectMasterLecturerCategoryIds,
      connectMasterSeminarDomainIds,
      ...createLecturerInput
    } = input

    // NOTE: 所属組織なしの場合はドキュメント送付先を組織にすることはできない
    if (
      !createLecturerInput.masterLecturerAffiliatedOrganizationId &&
      createLecturerInput.sendDocumentAddressType === 'ORGANIZATION'
    ) {
      throw new UnprocessableEntityException()
    }

    let uploadedImage: {
      path: string
      finish: () => void
      reset: () => void
    }
    let imagePath: string

    if (image) {
      try {
        const { mimetype, createReadStream } = await image
        uploadedImage = await this.storage.putFile({
          uploadType: 'PUBLIC',
          createReadStream,
          mimetype,
          path: 'lecturers',
          validate: 'IMAGE',
          resize: 'LECTURER_IMAGE'
        })
        imagePath = uploadedImage.path
      } catch (e) {
        this.logger.error(e.message)
        if (uploadedImage) {
          uploadedImage.reset()
        }
        throw new InternalServerErrorException()
      }
    }

    try {
      const createdLecturer = await this.prisma.lecturer.create({
        data: {
          ...createLecturerInput,
          imagePath,
          lecturerDetails: {
            create: {
              current: true,
              financialYear: this.date.currentFinancialYear
            }
          },
          lecturerContacts: {
            create: createLecturerContactInputs
          },
          lecturerEmergencyContacts: {
            create: createLecturerEmergencyContactInputs
          },
          masterLecturerCategories: {
            connect: connectMasterLecturerCategoryIds?.map((id) => {
              return { id }
            })
          },
          masterSeminarDomains: {
            connect: connectMasterSeminarDomainIds?.map((id) => {
              return { id }
            })
          }
        },
        include
      })
      if (uploadedImage) {
        uploadedImage.finish()
      }
      return createdLecturer
    } catch (e) {
      if (uploadedImage) {
        uploadedImage.reset()
      }
      this.logger.error(e.message)
      throw new InternalServerErrorException()
    }
  }

  async updateLecturer({
    input,
    include
  }: {
    input: UpdateLecturerInput
    include?: Prisma.LecturerInclude
  }) {
    const specificLecturer = await this.findLecturerById({
      id: input.id,
      include: {
        lecturerContract: true
      }
    })

    const {
      image,
      createLecturerContactInputs,
      createLecturerEmergencyContactInputs,
      updateLecturerContactInputs,
      updateLecturerEmergencyContactInputs,
      deleteLecturerContactIds,
      deleteLecturerEmergencyContactIds,
      connectMasterLecturerCategoryIds,
      disconnectMasterLecturerCategoryIds,
      connectMasterSeminarDomainIds,
      disconnectMasterSeminarDomainIds,
      ...updateLecturerInput
    } = input

    /**
     * NOTE: 以下の条件の場合には所属組織なし(null)に変更できない
     * - ドキュメント送付先がORGANIZATION
     * - 契約名義人タイプがORGANIZATION
     */
    if (updateLecturerInput.masterLecturerAffiliatedOrganizationId === null) {
      if (
        updateLecturerInput.sendDocumentAddressType !== 'HOME' &&
        specificLecturer.sendDocumentAddressType === 'ORGANIZATION'
      ) {
        throw new UnprocessableEntityException()
      }

      if (
        specificLecturer.lecturerContract &&
        specificLecturer.lecturerContract.contractorType === 'ORGANIZATION'
      ) {
        throw new UnprocessableEntityException()
      }
    }

    let uploadedImage: {
      path: string
      finish: () => void
      reset: () => void
    }
    let imagePath: string

    if (image) {
      try {
        const { mimetype, createReadStream } = await image
        uploadedImage = await this.storage.putFile({
          uploadType: 'PUBLIC',
          createReadStream,
          mimetype,
          path: 'lecturers',
          removeFilePath: specificLecturer.imagePath,
          validate: 'IMAGE',
          resize: 'LECTURER_IMAGE'
        })
        imagePath = uploadedImage.path
      } catch (e) {
        this.logger.error(e.message)
        if (uploadedImage) {
          uploadedImage.reset()
        }
        throw new InternalServerErrorException()
      }
    }

    try {
      return this.prisma.$transaction(async (prisma) => {
        const updatedLecturer = await prisma.lecturer.update({
          where: {
            id: updateLecturerInput.id
          },
          data: {
            ...updateLecturerInput,
            imagePath,
            lecturerContacts: {
              deleteMany: {
                id: {
                  in: deleteLecturerContactIds || []
                }
              },
              update: updateLecturerContactInputs?.map(
                (updateLecturerContactInput) => {
                  return {
                    where: {
                      id: updateLecturerContactInput.id
                    },
                    data: updateLecturerContactInput
                  }
                }
              ),
              create: createLecturerContactInputs
            },
            lecturerEmergencyContacts: {
              create: createLecturerEmergencyContactInputs,
              update: updateLecturerEmergencyContactInputs?.map(
                (updateLecturerEmergencyContactInput) => {
                  return {
                    where: {
                      id: updateLecturerEmergencyContactInput.id
                    },
                    data: updateLecturerEmergencyContactInput
                  }
                }
              ),
              deleteMany: {
                id: {
                  in: deleteLecturerEmergencyContactIds || []
                }
              }
            },
            masterLecturerCategories: {
              connect: connectMasterLecturerCategoryIds?.map((id) => {
                return { id }
              }),
              disconnect: disconnectMasterLecturerCategoryIds?.map((id) => {
                return { id }
              })
            },
            masterSeminarDomains: {
              connect: connectMasterSeminarDomainIds?.map((id) => {
                return { id }
              }),
              disconnect: disconnectMasterSeminarDomainIds?.map((id) => {
                return { id }
              })
            }
          },
          include
        })
        if (uploadedImage) {
          uploadedImage.finish()
        }
        return updatedLecturer
      })
    } catch (e) {
      if (uploadedImage) {
        uploadedImage.reset()
      }
      this.logger.error(e.message)
      throw new InternalServerErrorException()
    }
  }

  async deleteLecturer(id: number) {
    const specificLecturer = await this.findLecturerById({ id })

    // NOTE: アーカイブ済みでなければ削除不可とする
    if (!specificLecturer.archived) {
      throw new UnprocessableEntityException()
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.lecturer.delete({
        where: {
          id
        }
      })
      if (specificLecturer.imagePath) {
        this.storage.deleteFile(specificLecturer.imagePath)
      }
    })

    return true
  }
}
