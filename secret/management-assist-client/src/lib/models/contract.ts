export const contractTypes = ['HARD', 'SOFT'] as const
export const contractStatuses = ['DOING', 'ENDED', 'UPDATED'] as const
export type ContractType = (typeof contractTypes)[number]
export type ContractStatus = (typeof contractStatuses)[number]

export class Contract {
  public readonly id!: number
  public readonly customerId!: number
  public readonly departmentId?: number
  public readonly contractId?: number
  public readonly name!: string
  public readonly type!: ContractType
  public readonly status!: ContractStatus
  public readonly startDate!: Date
  public readonly endDate?: Date
  public readonly autoUpdateCountOfMonths?: number
  public readonly fileName?: string
  public originContract?: Contract
  public updatedContract?: Contract

  constructor(init: Partial<Contract>) {
    const { originContract, updatedContract, ...attr } = init
    Object.assign(this, attr)

    if (originContract) {
      this.originContract = new Contract(originContract)
    }

    if (updatedContract) {
      this.updatedContract = new Contract(updatedContract)
    }
  }

  get autoUpdate() {
    return !!this.autoUpdateCountOfMonths
  }

  get typeLabel() {
    return convertContractTypeLabel(this.type)
  }

  get statusLabel() {
    return convertContractStatusLabel(this.status)
  }
}

export const convertContractTypeLabel = (type: ContractType) => {
  switch (type) {
    case 'HARD': {
      return '紙'
    }
    case 'SOFT': {
      return '電子'
    }
    default: {
      return ''
    }
  }
}

export const convertContractStatusLabel = (status: ContractStatus) => {
  switch (status) {
    case 'DOING': {
      return '契約中'
    }
    case 'ENDED': {
      return '契約終了'
    }
    case 'UPDATED': {
      return '更新済'
    }
    default: {
      return ''
    }
  }
}
