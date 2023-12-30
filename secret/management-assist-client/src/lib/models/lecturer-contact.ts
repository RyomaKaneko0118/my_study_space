export const lecturerContactTypes = ['PHONE', 'EMAIL'] as const
export type LecturerContactType = (typeof lecturerContactTypes)[number]

export class LecturerContact {
  public readonly id!: number
  public readonly lecturerId!: number
  public readonly type!: LecturerContactType
  public readonly label!: string
  public readonly value!: string

  constructor(init: Partial<LecturerContact>) {
    Object.assign(this, init)
  }
}
