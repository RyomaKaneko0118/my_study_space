import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  LecturerContractType,
  LecturerContractContractorType
} from '@prisma/client'

import type { Lecturer } from '@src/www/graphql/lecturers/entity'

registerEnumType(LecturerContractType, {
  name: 'LecturerContractType'
})

registerEnumType(LecturerContractContractorType, {
  name: 'LecturerContractContractorType'
})

@ObjectType()
export class LecturerContract {
  @Field(() => Int)
  id: number
  @Field(() => Int)
  lecturerId: number
  @Field(() => LecturerContractType)
  type: LecturerContractType
  @Field(() => LecturerContractContractorType)
  contractorType: LecturerContractContractorType
  startDate: Date
  endDate?: Date
  note: string
  lecturer?: Lecturer
}
