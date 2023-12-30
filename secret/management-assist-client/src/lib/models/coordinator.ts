export const coordinatorRoles = ['MAIN', 'SUB'] as const
export type CoordinatorRole = (typeof coordinatorRoles)[number]

export class Coordinator {
  public readonly id!: number
  public readonly customerDetailId!: number
  public readonly saUserId!: number
  public readonly role!: CoordinatorRole

  constructor(init: Partial<Coordinator>) {
    Object.assign(this, init)
  }
}
