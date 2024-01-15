import {
  TrainingClassification,
  TrainingClassificationManager
} from '$lib/models'

export class Manager {
  public readonly id!: number
  public readonly customerId!: number
  public readonly departmentId?: number
  public readonly firstName!: string
  public readonly lastName!: string
  public readonly firstNameKana!: string
  public readonly lastNameKana!: string
  public readonly email?: string
  public readonly startYear!: number
  public readonly endYear?: number
  public readonly post!: string
  public readonly phoneNumber!: string
  public readonly note!: string
  public trainingClassificationManagers: TrainingClassificationManager[] = []

  constructor(init: Partial<Manager>) {
    const { trainingClassificationManagers, ...attr } = init
    Object.assign(this, attr)

    if (trainingClassificationManagers) {
      this.trainingClassificationManagers = trainingClassificationManagers.map(
        (trainingClassificationManager) =>
          new TrainingClassificationManager(trainingClassificationManager)
      )
    }
  }

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`
  }

  get fullNameKana(): string {
    return `${this.lastNameKana} ${this.firstNameKana}`
  }

  get mainTrainingClassifications(): TrainingClassification[] {
    return this.trainingClassificationManagers
      .filter(
        (trainingClassificationManager) =>
          trainingClassificationManager.role === 'MAIN'
      )
      .map(
        (trainingClassificationManager) =>
          trainingClassificationManager.trainingClassification as TrainingClassification
      )
  }

  get subTrainingClassifications(): TrainingClassification[] {
    return this.trainingClassificationManagers
      .filter(
        (trainingClassificationManager) =>
          trainingClassificationManager.role === 'SUB'
      )
      .map(
        (trainingClassificationManager) =>
          trainingClassificationManager.trainingClassification as TrainingClassification
      )
  }
}
