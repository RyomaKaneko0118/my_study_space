import { InputType, Field, Int } from '@nestjs/graphql'
import { TrainingClassificationCategory } from '@prisma/client'
import { Type } from 'class-transformer'
import { Allow, ValidateNested } from 'class-validator'

import { CreateTrainingClassificationCoordinatorInput } from '@src/www/graphql/training-classification-coordinators/dto'
import { CreateTrainingClassificationManagerInput } from '@src/www/graphql/training-classification-managers/dto'

@InputType()
export class CreateTrainingClassificationInput {
  @Field(() => Int)
  @Allow()
  customerId: number

  @Field(() => TrainingClassificationCategory)
  @Allow()
  name: TrainingClassificationCategory

  @Allow()
  departmentName: string

  @Field(() => Int)
  @Allow()
  year: number

  @Field(() => Int)
  @Allow()
  trainingPeriod: number

  @Field(() => Int)
  @Allow()
  sales?: number

  @Allow()
  note: string

  @ValidateNested()
  @Type(() => CreateTrainingClassificationCoordinatorInput)
  createTrainingClassificationCoordinatorInputs?: CreateTrainingClassificationCoordinatorInput[]

  @ValidateNested()
  @Type(() => CreateTrainingClassificationManagerInput)
  createTrainingClassificationManagerInputs?: CreateTrainingClassificationManagerInput[]
}

@InputType()
export class UpdateTrainingClassificationInput {
  @Field(() => Int)
  @Allow()
  id: number

  @Field(() => Int)
  @Allow()
  customerId?: number

  @Field(() => TrainingClassificationCategory)
  @Allow()
  name?: TrainingClassificationCategory

  @Allow()
  departmentName?: string

  @Field(() => Int)
  @Allow()
  year?: number

  @Field(() => Int)
  @Allow()
  trainingPeriod?: number

  @Field(() => Int)
  @Allow()
  sales?: number

  @Allow()
  note?: string

  @ValidateNested()
  @Type(() => CreateTrainingClassificationCoordinatorInput)
  createTrainingClassificationCoordinatorInputs?: CreateTrainingClassificationCoordinatorInput[]

  @ValidateNested()
  @Type(() => CreateTrainingClassificationManagerInput)
  createTrainingClassificationManagerInputs?: CreateTrainingClassificationManagerInput[]
}
