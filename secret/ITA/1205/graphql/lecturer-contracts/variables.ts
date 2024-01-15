import type {
  LecturerContractType,
  LecturerContractContractorType
} from '$lib/models'

export type CreateLecturerContractInput = {
  lecturerId: number
  type: LecturerContractType
  contractorType: LecturerContractContractorType
  startDate: Date
  endDate?: Date | null
  note: string
}

export type UpdateLecturerContractInput = {
  id: number
  type?: LecturerContractType
  contractorType?: LecturerContractContractorType
  startDate?: Date
  endDate?: Date | null
  note?: string
}
