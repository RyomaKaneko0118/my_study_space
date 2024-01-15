import { InputType, Field, Int } from '@nestjs/graphql'
import {
  LecturerContractType,
  LecturerContractContractorType
} from '@prisma/client'
import { Allow } from 'class-validator'

@InputType()
export class CreateLecturerContractInput {
  @Field(() => Int)
  @Allow()
  lecturerId: number

  @Field(() => LecturerContractType)
  @Allow()
  type: LecturerContractType

  @Field(() => LecturerContractContractorType)
  @Allow()
  contractorType: LecturerContractContractorType

  @Allow()
  startDate: Date

  @Allow()
  endDate?: Date

  @Allow()
  note: string
}

@InputType()
export class UpdateLecturerContractInput {
  @Field(() => Int)
  @Allow()
  id: number

  @Field(() => LecturerContractType)
  @Allow()
  type?: LecturerContractType

  @Field(() => LecturerContractContractorType)
  @Allow()
  contractorType?: LecturerContractContractorType

  @Allow()
  startDate?: Date

  @Allow()
  endDate?: Date

  @Allow()
  note?: string
}
