import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  TrainingClassificationCategory,
  TrainingClassificationRole
} from '@prisma/client'

import { OffsetPaginated } from '@src/www/graphql/offset-pagination'
import type { TrainingClassificationCoordinator } from '@src/www/graphql/training-classification-coordinators/entity'
import type { TrainingClassificationManager } from '@src/www/graphql/training-classification-managers/entity'

registerEnumType(TrainingClassificationCategory, {
  name: 'TrainingClassificationCategory'
})
registerEnumType(TrainingClassificationRole, {
  name: 'TrainingClassificationRole'
})

// Todo
@ObjectType()
export class TrainingClassification {
  @Field(() => Int)
  id: number
  @Field(() => Int)
  customerId: number
  @Field(() => TrainingClassificationCategory)
  name: TrainingClassificationCategory
  departmentName: string
  year: number
  @Field(() => Int)
  trainingPeriod: number
  @Field(() => Int)
  sales?: number
  note: string
  trainingClassificationCoordinators?: TrainingClassificationCoordinator[]
  trainingClassificationManagers?: TrainingClassificationManager[]
}

@ObjectType()
export class PaginatedTrainingClassifications extends OffsetPaginated(
  TrainingClassification
) {}

@ObjectType()
export class tmpT {
  result: TrainingClassification[]
  count: number
}
