import type { CreateCoordinatorInput } from '$api/graphql/coordinators'

export type CreateCustomerDetailInput = {
  link: string
  parent: string
  affiliate: string
  note: string
  createCoordinatorInputs?: CreateCoordinatorInput[]
}

export type UpdateCustomerDetailInput = {
  link?: string
  parent?: string
  affiliate?: string
  note?: string
  createCoordinatorInputs?: CreateCoordinatorInput[]
  deleteCoordinatorIds?: number[]
}
