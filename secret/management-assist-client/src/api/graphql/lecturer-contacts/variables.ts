import type { LecturerContactType } from '$lib/models'

export type CreateLecturerContactInput = {
  type: LecturerContactType
  label: string
  value: string
}

export type UpdateLecturerContactInput = {
  id: number
  label?: string
  value?: string
}
