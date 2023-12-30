import { CustomerDetail, CustomerPin, Department, Manager } from '$lib/models'

export class Customer {
  public readonly id!: number
  public readonly boardClientId!: number
  public readonly saCompanyId?: number
  public readonly archived!: boolean
  public readonly dealingStartDate!: Date
  public readonly dealingEndDate?: Date
  public readonly dealingPeriod?: number
  public readonly logoUrl?: string
  public readonly contractNote!: string
  public currentCustomerDetail?: CustomerDetail
  public customerDetails: CustomerDetail[] = []
  public customerPins: CustomerPin[] = []
  public departments: Department[] = []
  public managers: Manager[] = []

  constructor(init: Partial<Customer>) {
    const {
      currentCustomerDetail,
      customerDetails,
      customerPins,
      departments,
      managers,
      ...attr
    } = init
    Object.assign(this, attr)

    if (currentCustomerDetail) {
      this.currentCustomerDetail = new CustomerDetail(currentCustomerDetail)
    }

    if (customerDetails) {
      this.customerDetails = customerDetails.map(
        (customerDetail) => new CustomerDetail(customerDetail)
      )
    }

    if (customerPins) {
      this.customerPins = customerPins.map(
        (customerPin) => new CustomerPin(customerPin)
      )
    }

    if (departments) {
      this.departments = departments.map(
        (department) => new Department(department)
      )
    }

    if (managers) {
      this.managers = managers.map((manager) => new Manager(manager))
    }
  }

  get pinned() {
    return this.customerPins.length !== 0
  }
}
