import {
  ArgsType,
  InputType,
  Field,
  Int,
  registerEnumType
} from '@nestjs/graphql'
import { ContractCategory, ContractType } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { Allow } from 'class-validator'

import { SortDirection } from '@src/www/graphql/field-order'
import { OffsetPaginationArgs } from '@src/www/graphql/offset-pagination'

const prisma = new PrismaClient()

// NOTE: orderByで直接扱う可能性を考慮しvalueはlowerCamel
export enum ContractsField {
  ID = 'id',
  DEPARTMENT = 'department',
  START_DATE = 'start_date',
  END_DATE = 'end_date',
  TYPE = 'type'
}

registerEnumType(ContractsField, {
  name: 'ContractsField'
})

@ArgsType()
export class ContractsArgs extends OffsetPaginationArgs {
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

  @Allow()
  name: string

  @Allow()
  contractor: string

  @Field(() => ContractType)
  @Allow()
  contractType: ContractType

  @Field(() => ContractCategory)
  @Allow()
  contractCategory: ContractCategory

  @Allow()
  dealingStartDate: Date

  @Allow()
  dealingEndDate: Date

  @Allow()
  autoUpdated: boolean
}

@InputType()
export class UpdateContractInput {
  @Field(() => Int)
  @Allow()
  id: number

  @Field(() => Int)
  @Allow()
  customerId?: number

  @Allow()
  name?: string

  @Allow()
  contractor?: string

  @Field(() => ContractType)
  @Allow()
  contractType?: ContractType

  @Field(() => ContractCategory)
  @Allow()
  contractCategory?: ContractCategory

  @Allow()
  dealingStartDate?: Date

  @Allow()
  dealingEndDate?: Date

  @Allow()
  autoUpdated?: boolean
}
