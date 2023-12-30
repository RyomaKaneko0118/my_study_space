export class LecturerEmergencyContact {
  public readonly id!: number
  public readonly lecturerId!: number
  public readonly name!: string
  public readonly relationship!: string
  public readonly phoneNumber!: string

  constructor(init: Partial<LecturerEmergencyContact>) {
    Object.assign(this, init)
  }
}
