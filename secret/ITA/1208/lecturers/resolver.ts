import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql'

import { Auth, AuthContext } from '@src/www/graphql/auth-decorator'
import {
  LecturersArgs,
  CreateLecturerInput,
  UpdateLecturerInput
} from '@src/www/graphql/lecturers/dto'
import { Lecturer, PaginatedLecturers } from '@src/www/graphql/lecturers/entity'
import { LecturersService } from '@src/www/graphql/lecturers/service'
import { createOffsetPaginated } from '@src/www/graphql/offset-pagination'

import type { Prisma } from '@prisma/client'

const DEFAULT_LECTURER_INCLUDES: Prisma.LecturerInclude = {
  masterLecturerAffiliatedOrganization: true,
  lecturerContract: true,
  lecturerDetails: {
    orderBy: {
      financialYear: 'desc'
    }
  },
  lecturerContacts: {
    orderBy: {
      id: 'asc'
    }
  },
  lecturerEmergencyContacts: {
    orderBy: {
      id: 'asc'
    }
  },
  masterLecturerCategories: {
    orderBy: {
      id: 'asc'
    }
  },
  masterSeminarDomains: {
    orderBy: {
      id: 'asc'
    }
  }
}

@Resolver()
export class LecturersResolver {
  constructor(private readonly lecturersService: LecturersService) {}

  @Query(() => PaginatedLecturers)
  @Auth()
  async lecturers(
    @AuthContext() authContext: AuthContext,
    @Args()
    lecturersArgs: LecturersArgs
  ): Promise<PaginatedLecturers> {
    const { result, count } =
      await this.lecturersService.findLecturersWithCount({
        saUserId: authContext.id,
        lecturersArgs
      })
    return createOffsetPaginated({
      result,
      count,
      offsetPaginationArgs: lecturersArgs
    })
  }

  @Query(() => Lecturer)
  @Auth()
  lecturer(@Args('id', { type: () => Int }) id: number): Promise<Lecturer> {
    return this.lecturersService.findLecturerById({
      id,
      include: DEFAULT_LECTURER_INCLUDES
    })
  }

  @Mutation(() => Lecturer)
  @Auth()
  createLecturer(
    @Args('createLecturerInput')
    input: CreateLecturerInput
  ): Promise<Lecturer> {
    return this.lecturersService.createLecturer({
      input,
      include: DEFAULT_LECTURER_INCLUDES
    })
  }

  @Mutation(() => Lecturer)
  @Auth()
  updateLecturer(
    @Args('updateLecturerInput')
    input: UpdateLecturerInput
  ): Promise<Lecturer> {
    return this.lecturersService.updateLecturer({
      input,
      include: DEFAULT_LECTURER_INCLUDES
    })
  }

  @Mutation(() => Boolean)
  @Auth()
  deleteLecturer(
    @Args('id', { type: () => Int }) id: number
  ): Promise<boolean> {
    return this.lecturersService.deleteLecturer(id)
  }
}
