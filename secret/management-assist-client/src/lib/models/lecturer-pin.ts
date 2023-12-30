export class LecturerPin {
  public readonly lecturerId!: number
  public readonly saUserId!: number

  constructor(init: Partial<LecturerPin>) {
    Object.assign(this, init)
  }
}
