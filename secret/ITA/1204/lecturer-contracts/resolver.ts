import { Args, Resolver, Mutation } from '@nestjs/graphql'

import { Auth } from '@src/www/graphql/auth-decorator'
import {
  CreateLecturerContractInput,
  UpdateLecturerContractInput
} from '@src/www/graphql/lecturer-contracts/dto'
import { LecturerContract } from '@src/www/graphql/lecturer-contracts/entity'
import { LecturerContractsService } from '@src/www/graphql/lecturer-contracts/service'

@Resolver()
export class LecturerContractsResolver {
  constructor(
    private readonly lecturerContractsService: LecturerContractsService
  ) {}

  @Mutation(() => LecturerContract)
  @Auth()
  createLecturerContract(
    @Args('createLecturerContractInput')
    input: CreateLecturerContractInput
  ): Promise<LecturerContract> {
    return this.lecturerContractsService.createLecturerContract(input)
  }

  @Mutation(() => LecturerContract)
  // @Auth()
  updateLecturerContract(
    @Args('updateLecturerContractInput')
    input: UpdateLecturerContractInput
  ): Promise<LecturerContract> {
    return this.lecturerContractsService.updateLecturerContract(input)
  }
}
