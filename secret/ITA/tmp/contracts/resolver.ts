import { Args, Resolver, Query, Int, Mutation } from '@nestjs/graphql'

import { Auth } from '@src/www/graphql/auth-decorator'
import {
  CreateContractInput,
  ContractsArgs,
  UpdateContractInput
} from '@src/www/graphql/contracts/dto'
import { Contract, PaginatedContracts } from '@src/www/graphql/contracts/entity'
import { ContractsService } from '@src/www/graphql/contracts/service'
import { createOffsetPaginated } from '@src/www/graphql/offset-pagination'

@Resolver()
export class ContractsResolver {
  constructor(private readonly contractsService: ContractsService) {}

  @Query(() => PaginatedContracts)
  // @Auth()
  async contracts(
    @Args()
    contractsArgs: ContractsArgs
  ): Promise<PaginatedContracts> {
    const { result, count } =
      await this.contractsService.findContractsWithCount(contractsArgs)
    return createOffsetPaginated({
      result,
      count,
      offsetPaginationArgs: contractsArgs
    })
  }

  @Query(() => Contract)
  // @Auth()
  async contract(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Contract> {
    return this.contractsService.findContractById({
      id,
      include: {
        customer: true
      }
    })
  }

  @Mutation(() => Contract)
  // @Auth()
  createContract(
    @Args('createContractInput')
    input: CreateContractInput
  ): Promise<Contract> {
    return this.contractsService.createContract(input)
  }

  @Mutation(() => Contract)
  @Auth()
  updateContract(
    @Args('updateContractInput')
    input: UpdateContractInput
  ): Promise<Contract> {
    return this.contractsService.updateContract(input)
  }

  @Mutation(() => Boolean)
  @Auth()
  deleteContract(
    @Args('id', { type: () => Int }) id: number
  ): Promise<boolean> {
    return this.contractsService.deleteContract(id)
  }
}
