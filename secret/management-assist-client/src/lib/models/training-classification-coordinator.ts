import { Coordinator } from '$lib/models'

export const trainingClassificationCoordinatorRoles = ['MAIN', 'SUB'] as const
export type TrainingClassificationCoordinatorRole =
  (typeof trainingClassificationCoordinatorRoles)[number]

export class TrainingClassificationCoordinator {
  public readonly id!: number
  public readonly trainingClassificationId!: number
  public readonly coordinatorId!: number
  public readonly role!: TrainingClassificationCoordinatorRole
  public coordinator?: Coordinator

  constructor(init: Partial<TrainingClassificationCoordinator>) {
    const { coordinator, ...attr } = init
    Object.assign(this, attr)

    if (coordinator) {
      this.coordinator = new Coordinator(coordinator)
    }
  }
}
