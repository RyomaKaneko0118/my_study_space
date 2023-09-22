import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'

import { LoggerService } from '@src/lib/logger/service'
import { PrismaService } from '@src/lib/prisma/service'

import type {
  CreateTrainingClassificationInput,
  UpdateTrainingClassificationInput
} from '@src/www/graphql/training-classifications/dto'

import type { Prisma } from '@prisma/client'

@Injectable()
export class TrainingClassificationsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService
  ) {}

  async findTrainingClassifications() {
    return await this.prisma.trainingClassification.findMany({
      orderBy: {
        sales: 'desc'
      },
      include: {
        customer: true,
        trainingClassificationCoordinators: true,
        trainingClassificationManagers: true
      }
    })
  }

  async findTrainingClassificationById({
    id,
    include
  }: {
    id: number
    include?: Prisma.TrainingClassificationInclude
  }) {
    const result = await this.prisma.trainingClassification.findUnique({
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

  async createTrainingClassification(input: CreateTrainingClassificationInput) {
    const {
      createTrainingClassificationCoordinatorInputs,
      createTrainingClassificationManagerInputs,
      ...CreateTrainingClassificationInput
    } = input
    try {
      return await this.prisma.trainingClassification.create({
        data: {
          ...CreateTrainingClassificationInput,
          trainingClassificationCoordinators: {
            create: createTrainingClassificationCoordinatorInputs
          },
          trainingClassificationManagers: {
            create: createTrainingClassificationManagerInputs
          }
        },
        include: {
          trainingClassificationCoordinators: true,
          trainingClassificationManagers: true
        }
      })
    } catch (e) {
      this.logger.error(e.message)
      throw new InternalServerErrorException()
    }
  }

  async updateTrainingClassification(input: UpdateTrainingClassificationInput) {
    const specificTrainingClassification =
      await this.findTrainingClassificationById({ id: input.id })

    try {
      return await this.prisma.trainingClassification.update({
        where: {
          id: specificTrainingClassification.id
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

  async deleteTrainingClassification(id: number) {
    await this.findTrainingClassificationById({ id })

    await this.prisma.trainingClassification.delete({
      where: {
        id
      }
    })

    return true
  }
}
