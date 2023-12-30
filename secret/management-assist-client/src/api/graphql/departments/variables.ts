export type CreateDepartmentInput = {
  customerId: number
  name: string
  dealingStartDate: Date
  note: string
  postalCode?: string
  prefectureCode?: number
  city?: string
  town?: string
  addressLine?: string
}

export type UpdateDepartmentInput = {
  id: number
  name?: string
  dealingStartDate?: Date
  dealingEndDate?: Date | null
  note?: string
  postalCode?: string
  prefectureCode?: number | null
  city?: string
  town?: string
  addressLine?: string
}
