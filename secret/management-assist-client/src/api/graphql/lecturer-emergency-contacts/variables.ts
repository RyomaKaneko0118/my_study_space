export type CreateLecturerEmergencyContactInput = {
  name: string
  relationship: string
  phoneNumber: string
}

export type UpdateLecturerEmergencyContactInput = {
  id: number
  name?: string
  relationship?: string
  phoneNumber?: string
}
