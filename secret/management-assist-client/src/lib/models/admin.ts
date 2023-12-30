export class Admin {
  public readonly saUserId!: number
  public readonly firstName!: string
  public readonly lastName!: string
  public readonly businnessName!: string

  constructor(init: Partial<Admin>) {
    Object.assign(this, init)
  }

  get displayName() {
    return this.businnessName || `${this.lastName} ${this.firstName}`
  }
}
