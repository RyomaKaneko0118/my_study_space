export const lecturerContractTypes = ['DIRECT', 'CROWDWORKS'] as const
export const lecturerContractContractorTypes = [
  'INDIVIDUAL',
  'ORGANIZATION'
] as const

export type LecturerContractType = (typeof lecturerContractTypes)[number]
export type LecturerContractContractorType =
  (typeof lecturerContractContractorTypes)[number]

export class LecturerContract {
  public readonly id!: number
  public readonly lecturerId!: number
  public readonly type!: LecturerContractType
  public readonly contractorType!: LecturerContractContractorType
  public readonly startDate!: Date
  public readonly endDate?: Date
  public readonly note!: string
  public readonly isEnded?: boolean

  constructor(init: Partial<LecturerContract>) {
    Object.assign(this, init)
  }

  get typeLabel() {
    return convertLecturerContractTypeLabel(this.type)
  }

  get contractorTypeLabel() {
    return convertLecturerContractContractorTypeLabel(this.contractorType)
  }

  get statusLabel() {
    return this.isEnded ? '契約終了' : '契約中'
  }
}

export const convertLecturerContractTypeLabel = (
  type: LecturerContractType
) => {
  switch (type) {
    case 'DIRECT': {
      return '直接'
    }
    case 'CROWDWORKS': {
      return 'クラウドワークス'
    }
    default: {
      return ''
    }
  }
}

export const convertLecturerContractContractorTypeLabel = (
  type: LecturerContractContractorType
) => {
  switch (type) {
    case 'INDIVIDUAL': {
      return '個人'
    }
    case 'ORGANIZATION': {
      return '組織'
    }
    default: {
      return ''
    }
  }
}
