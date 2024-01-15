import { TrainingClassification, Manager } from '$lib/models'

export const trainingClassificationManagerRoles = ['MAIN', 'SUB'] as const
export type TrainingClassificationManagerRole =
  (typeof trainingClassificationManagerRoles)[number]

export class TrainingClassificationManager {
  public readonly id!: number
  public readonly trainingClassificationId!: number
  public readonly managerId!: number
  public readonly role!: TrainingClassificationManagerRole
  public trainingClassification?: TrainingClassification
  public manager?: Manager

  constructor(init: Partial<TrainingClassificationManager>) {
    const { trainingClassification, manager, ...attr } = init
    Object.assign(this, attr)

    if (trainingClassification) {
      this.trainingClassification = new TrainingClassification(
        trainingClassification
      )
    }

    if (manager) {
      this.manager = new Manager(manager)
    }
  }
}
