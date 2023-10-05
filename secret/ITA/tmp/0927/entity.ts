import {
  Field,
  FieldMiddleware,
  Int,
  MiddlewareContext,
  NextFn,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'
import { ContractStatus, ContractType } from '@prisma/client'

import { OffsetPaginated } from '@src/www/graphql/offset-pagination'

registerEnumType(ContractType, {
  name: 'ContractType'
})

registerEnumType(ContractStatus, {
  name: 'ContractStatus'
})

const filePathToUrlMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  await next()
  if (!ctx.source.filePath) {
    return null
  }

  return `${process.env.FILE_URL}/${ctx.source.filePath}`
}

@ObjectType()
export class Contract {
  @Field(() => Int)
  id: number
  @Field(() => Int)
  customerId: number
  @Field(() => Int)
  departmentId?: number
  @Field(() => Int)
  contractId?: number
  name: string
  @Field(() => ContractType)
  type: ContractType
  @Field(() => ContractStatus)
  status: ContractStatus
  startDate: Date
  endDate?: Date
  @Field(() => Int)
  autoUpdateCountOfMonths?: number
  @Field({ middleware: [filePathToUrlMiddleware] })
  fileUrl?: string
  originContract?: Contract
  updatedContract?: Contract
}

@ObjectType()
export class PaginatedContracts extends OffsetPaginated(Contract) {}
