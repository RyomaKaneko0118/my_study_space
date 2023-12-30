export class Client {
  public readonly id!: number
  public readonly customerId?: number
  public readonly name!: string
  public readonly nameDisp!: string
  public readonly zip?: string
  public readonly pref?: string
  public readonly address1?: string
  public readonly address2?: string

  constructor(init: Partial<Client>) {
    Object.assign(this, init)
  }
}
