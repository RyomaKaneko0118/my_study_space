export class CustomerPin {
  public readonly customerId!: number
  public readonly saUserId!: number

  constructor(init: Partial<CustomerPin>) {
    Object.assign(this, init)
  }
}
