import {
  ArgsType,
  InputType,
  Field,
  Int,
  registerEnumType
} from '@nestjs/graphql'
import { ContractType } from '@prisma/client'
import { Allow } from 'class-validator'
import { GraphQLUpload, type FileUpload } from 'graphql-upload'

import { SortDirection } from '@src/www/graphql/field-order'
import { OffsetPaginationArgs } from '@src/www/graphql/offset-pagination'

// NOTE: orderByで直接扱う可能性を考慮しvalueはlowerCamel
export enum ContractsField {
  ID = 'id',
  DEPARTMENT = 'department',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  TYPE = 'type',
  STATUS = 'status'
}

registerEnumType(ContractsField, {
  name: 'ContractsField'
})

@ArgsType()
export class ContractsArgs extends OffsetPaginationArgs {
  @Field(() => Int)
  @Allow()
  customerId: number

  @Allow()
  includeOrigin?: boolean

  @Field(() => ContractsField)
  @Allow()
  field?: ContractsField

  @Field(() => SortDirection, { defaultValue: 'asc' })
  @Allow()
  direction?: SortDirection
}

@InputType()
export class CreateContractInput {
  @Field(() => Int)
  @Allow()
  customerId: number

  @Field(() => Int)
  @Allow()
  departmentId?: number

  @Allow()
  name: string

  @Field(() => ContractType)
  @Allow()
  type: ContractType

  @Allow()
  startDate: Date

  @Field(() => Int)
  @Allow()
  autoUpdateCountOfMonths?: number

  @Field(() => GraphQLUpload)
  @Allow()
  file?: FileUpload
}

@InputType()
export class UpdateContractInput {
  @Field(() => Int)
  @Allow()
  id: number

  @Field(() => Int)
  @Allow()
  departmentId?: number

  @Allow()
  name?: string

  @Field(() => ContractType)
  @Allow()
  type?: ContractType

  @Allow()
  startDate?: Date

  @Allow()
  endDate?: Date

  @Field(() => Int)
  @Allow()
  autoUpdateCountOfMonths?: number

  @Field(() => GraphQLUpload)
  @Allow()
  file?: FileUpload
}
