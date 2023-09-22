export type CreateManagerInput = {
  customerId: number
  departmentId?: number
  firstName: string
  lastName: string
  firstNameKana: string
  lastNameKana: string
  email: string
  startYear: number
  post: string
  role: string
  phoneNumber: string
  note: string
}

export type UpdateManagerInput = {
  id: number
  departmentId?: number | null
  firstName?: string
  lastName?: string
  firstNameKana?: string
  lastNameKana?: string
  email?: string
  startYear?: number
  endYear?: number | null
  post?: string
  role?: string
  phoneNumber?: string
  note?: string
}
