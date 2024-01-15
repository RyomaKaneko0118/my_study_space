import { InputType, Field, Int } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class CreateLecturerEmergencyContactInput {
  @Allow()
  name: string

  @Allow()
  relationship: string

  @Allow()
  phoneNumber: string
}

@InputType()
export class UpdateLecturerEmergencyContactInput {
  @Field(() => Int)
  @Allow()
  id: number

  @Allow()
  name?: string

  @Allow()
  relationship?: string

  @Allow()
  phoneNumber?: string
}
