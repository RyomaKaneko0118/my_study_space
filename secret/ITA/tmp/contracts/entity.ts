import {
  Field,
  FieldMiddleware,
  Int,
  MiddlewareContext,
  NextFn,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'
import { ContractCategory, ContractType } from '@prisma/client'

import { DateService } from '@src/lib/date/service'

import { OffsetPaginated } from '@src/www/graphql/offset-pagination'

registerEnumType(ContractType, {
  name: 'ContractType'
})

registerEnumType(ContractCategory, {
  name: 'ContractCategory'
})

const date = new DateService()

const contractStatusMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  await next()
  if (!ctx.source.dealingStartDate || !ctx.source.dealingEndDate) {
    return null
  }

  const current = date.current
  if (
    current.isBetween(ctx.source.dealingStartDate, ctx.source.dealingEndDate)
  ) {
    return '契約中'
  }

  if (current.isBefore(ctx.source.dealingStartDate)) {
    return '未契約'
  }
  if (current.isAfter(ctx.source.dealingEndDate)) {
    return '契約終了'
  }
}

@ObjectType()
export class Contract {
  @Field(() => Int)
  id: number
  @Field(() => Int)
  customerId: number
  name: string
  contractor: string
  @Field({ middleware: [contractStatusMiddleware] })
  status?: string
  @Field(() => ContractType)
  contractType: ContractType
  @Field(() => ContractCategory)
  contractCategory: ContractCategory
  dealingStartDate: Date
  dealingEndDate: Date
  autoUpdated: boolean
}

@ObjectType()
export class PaginatedContracts extends OffsetPaginated(Contract) {}
