import { convertPrefectureLabel } from '$lib/models'

export class Department {
  public readonly id!: number
  public readonly customerId!: number
  public readonly name!: string
  public readonly dealingStartDate!: Date
  public readonly dealingEndDate?: Date
  public readonly dealingPeriod?: number
  public readonly note!: string
  public readonly postalCode!: string
  public readonly prefectureCode?: number
  public readonly city!: string
  public readonly town!: string
  public readonly addressLine!: string

  constructor(init: Partial<Department>) {
    Object.assign(this, init)
  }

  get prefecture(): string {
    if (this.prefectureCode) {
      return convertPrefectureLabel(this.prefectureCode)
    } else {
      return ''
    }
  }

  get fullAddress(): string {
    return `${this.prefecture} ${this.city} ${this.town} ${this.addressLine}`
  }
}
