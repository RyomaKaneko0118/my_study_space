import { Coordinator } from '$lib/models'

export class CustomerDetail {
  public readonly id!: number
  public readonly customerId!: number
  public readonly name!: string
  public readonly nameDisp!: string
  public readonly sales?: number
  public readonly zip?: string
  public readonly pref?: string
  public readonly address1?: string
  public readonly address2?: string
  public readonly financialYear!: number
  public readonly link!: string
  public readonly parent!: string
  public readonly affiliate!: string
  public readonly note!: string
  public coordinators: Coordinator[] = []

  constructor(init: Partial<CustomerDetail>) {
    const { coordinators, ...attr } = init
    Object.assign(this, attr)

    if (coordinators) {
      this.coordinators = coordinators.map(
        (coordinator) => new Coordinator(coordinator)
      )
    }
  }

  get salesDisplay() {
    if (this.sales || this.sales === 0) {
      return `¥${this.sales.toLocaleString()}`
    } else {
      return '未同期'
    }
  }

  get addressDisplay() {
    let address = ''
    if (this.pref) {
      address = `${this.pref} `
    }
    if (this.address1) {
      address = address + `${this.address1} `
    }
    if (this.address2) {
      address = address + this.address2
    }
    return address
  }

  get mainCoordinators() {
    return this.coordinators.filter(
      (coordinator) => coordinator.role === 'MAIN'
    )
  }

  get subCoordinators() {
    return this.coordinators.filter((coordinator) => coordinator.role === 'SUB')
  }
}
