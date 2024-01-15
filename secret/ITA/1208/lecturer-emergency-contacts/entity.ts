import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LecturerEmergencyContact {
  @Field(() => Int)
  id: number
  @Field(() => Int)
  lecturerId: number
  name: string
  relationship: string
  phoneNumber: string
}
