import { Lecturer, convertPrefectureLabel } from '$lib/models'

export class MasterLecturerAffiliatedOrganization {
  public readonly id!: number
  public readonly name!: string
  public readonly representativeName!: string
  public readonly representativePost!: string
  public readonly invoiceNumber?: string
  public readonly corporateNumber?: string
  public readonly equityStock?: number
  public readonly link!: string
  public readonly phoneNumber!: string
  public readonly postalCode!: string
  public readonly prefectureCode?: number
  public readonly city!: string
  public readonly town!: string
  public readonly addressLine!: string
  public lecturers: Lecturer[] = []

  constructor(init: Partial<MasterLecturerAffiliatedOrganization>) {
    const { lecturers, ...attr } = init
    Object.assign(this, attr)

    if (lecturers) {
      this.lecturers = lecturers.map((lecturer) => new Lecturer(lecturer))
    }
  }

  get equityStockDisplay() {
    if (this.equityStock) {
      return `${this.equityStock.toLocaleString()}万円`
    } else {
      return ''
    }
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
