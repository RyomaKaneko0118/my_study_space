export class MasterLecturerCategory {
  public readonly id!: number
  public readonly name!: string

  constructor(init: Partial<MasterLecturerCategory>) {
    Object.assign(this, init)
  }
}
