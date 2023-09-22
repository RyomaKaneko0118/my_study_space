import { Args, Resolver, Query, Int, Mutation } from '@nestjs/graphql'

import { Auth } from '@src/www/graphql/auth-decorator'
import {
  CreateTrainingClassificationInput,
  UpdateTrainingClassificationInput
} from '@src/www/graphql/training-classifications/dto'
import { TrainingClassification } from '@src/www/graphql/training-classifications/entity'
import { TrainingClassificationsService } from '@src/www/graphql/training-classifications/service'

@Resolver()
export class TrainingClassificationsResolver {
  constructor(
    private readonly trainingClassificationsService: TrainingClassificationsService
  ) {}

  // Todo
  @Query(() => TrainingClassification)
  // @Auth()
  async trainingClassifications(): Promise<TrainingClassification[]> {
    return await this.trainingClassificationsService.findTrainingClassifications()
  }

  @Query(() => TrainingClassification)
  // @Auth()
  async trainingClassification(
    @Args('id', { type: () => Int }) id: number
  ): Promise<TrainingClassification> {
    return this.trainingClassificationsService.findTrainingClassificationById({
      id,
      include: {
        customer: true
      }
    })
  }

  @Mutation(() => TrainingClassification)
  // @Auth()
  createTrainingClassification(
    @Args('createTrainingClassificationInput')
    input: CreateTrainingClassificationInput
  ): Promise<TrainingClassification> {
    return this.trainingClassificationsService.createTrainingClassification(
      input
    )
  }

  @Mutation(() => TrainingClassification)
  @Auth()
  updateTrainingClassification(
    @Args('updateTrainingClassificationInput')
    input: UpdateTrainingClassificationInput
  ): Promise<TrainingClassification> {
    return this.trainingClassificationsService.updateTrainingClassification(
      input
    )
  }

  @Mutation(() => Boolean)
  @Auth()
  deleteTrainingClassification(
    @Args('id', { type: () => Int }) id: number
  ): Promise<boolean> {
    return this.trainingClassificationsService.deleteTrainingClassification(id)
  }
}
