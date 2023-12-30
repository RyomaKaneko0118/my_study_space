export class LecturerFee {
  public readonly id!: number
  public readonly lecturerDetailId!: number
  public readonly label!: string
  public readonly fee!: number
  public readonly note!: string

  constructor(init: Partial<LecturerFee>) {
    Object.assign(this, init)
  }

  get feeDisplay() {
    return `¥${this.fee.toLocaleString()}`
  }

  get feeByHourlyRateDisplay() {
    return `¥${(Math.ceil(this.fee / 7 / 100) * 100).toLocaleString()}`
  }
}
