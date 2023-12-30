import type { ContractType } from '$lib/models'

export type CreateContractInput = {
  customerId: number
  departmentId?: number
  name: string
  type: ContractType
  startDate: Date
  endDate?: Date
  autoUpdateCountOfMonths?: number
  file?: File | null
}

export type UpdateContractInput = {
  id: number
  departmentId?: number | null
  name?: string
  type?: ContractType
  startDate?: Date
  endDate?: Date | null
  autoUpdateCountOfMonths?: number | null
  file?: File | null
}
