import type {
  CreateCustomerDetailInput,
  UpdateCustomerDetailInput
} from '$api/graphql/customer-details'

export type CreateCustomerInput = {
  boardClientId: number
  dealingStartDate: Date
  logo?: File | null
  contractNote: string
  createCustomerDetailInput: CreateCustomerDetailInput
}

export type UpdateCustomerInput = {
  id: number
  archived?: boolean
  dealingStartDate?: Date
  dealingEndDate?: Date | null
  logo?: File | null
  contractNote?: string
  updateCustomerDetailInput: UpdateCustomerDetailInput
}
