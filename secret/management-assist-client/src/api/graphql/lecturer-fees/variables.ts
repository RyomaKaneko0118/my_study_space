export type CreateLecturerFeeInput = {
  label: string
  fee: number
  note: string
}

export type UpdateLecturerFeeInput = {
  id: number
  label?: string
  fee?: number
  note?: string
}

export type UpdateLecturerFeesInput = {
  lecturerDetailId: number
  createLecturerFeeInputs?: CreateLecturerFeeInput[]
  updateLecturerFeeInputs?: UpdateLecturerFeeInput[]
  deleteLecturerFeeIds?: number[]
}
