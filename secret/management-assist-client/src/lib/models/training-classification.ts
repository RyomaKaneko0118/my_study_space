import {
  Coordinator,
  Manager,
  TrainingClassificationCoordinator,
  TrainingClassificationManager
} from '$lib/models'

export const trainingClassificationTypes = [
  'NEW_EMPLOYEE',
  'CURRENT_EMPLOYEE',
  'PROSPECTIVE_EMPLOYEE',
  'INTERNSHIP'
] as const
export type TrainingClassificationType =
  (typeof trainingClassificationTypes)[number]

export class TrainingClassification {
  public readonly id!: number
  public readonly customerDetailId!: number
  public readonly departmentId?: number
  public readonly type!: TrainingClassificationType
  public readonly trainingDays!: number
  public readonly sales!: number
  public readonly note!: string
  public trainingClassificationCoordinators: TrainingClassificationCoordinator[] =
    []
  public trainingClassificationManagers: TrainingClassificationManager[] = []

  constructor(init: Partial<TrainingClassification>) {
    const {
      trainingClassificationCoordinators,
      trainingClassificationManagers,
      ...attr
    } = init
    Object.assign(this, attr)

    if (trainingClassificationCoordinators) {
      this.trainingClassificationCoordinators =
        trainingClassificationCoordinators.map(
          (trainingClassificationCoordinator) =>
            new TrainingClassificationCoordinator(
              trainingClassificationCoordinator
            )
        )
    }

    if (trainingClassificationManagers) {
      this.trainingClassificationManagers = trainingClassificationManagers.map(
        (trainingClassificationManager) =>
          new TrainingClassificationManager(trainingClassificationManager)
      )
    }
  }

  get typeLabel() {
    return convertTrainingClassificationTypeLabel(this.type)
  }

  get mainCoordinators(): Coordinator[] {
    return this.trainingClassificationCoordinators
      .filter(
        (trainingClassificationCoordinator) =>
          trainingClassificationCoordinator.role === 'MAIN'
      )
      .map(
        (trainingClassificationCoordinator) =>
          trainingClassificationCoordinator.coordinator as Coordinator
      )
  }

  get subCoordinators(): Coordinator[] {
    return this.trainingClassificationCoordinators
      .filter(
        (trainingClassificationCoordinator) =>
          trainingClassificationCoordinator.role === 'SUB'
      )
      .map(
        (trainingClassificationCoordinator) =>
          trainingClassificationCoordinator.coordinator as Coordinator
      )
  }

  get mainManagers(): Manager[] {
    return this.trainingClassificationManagers
      .filter(
        (trainingClassificationManager) =>
          trainingClassificationManager.role === 'MAIN'
      )
      .map(
        (trainingClassificationManager) =>
          trainingClassificationManager.manager as Manager
      )
  }

  get subManagers(): Manager[] {
    return this.trainingClassificationManagers
      .filter(
        (trainingClassificationManager) =>
          trainingClassificationManager.role === 'SUB'
      )
      .map(
        (trainingClassificationManager) =>
          trainingClassificationManager.manager as Manager
      )
  }
}

export const convertTrainingClassificationTypeLabel = (
  type: TrainingClassificationType
) => {
  switch (type) {
    case 'NEW_EMPLOYEE': {
      return '新人研修'
    }
    case 'CURRENT_EMPLOYEE': {
      return '既存研修'
    }
    case 'PROSPECTIVE_EMPLOYEE': {
      return '内定者研修'
    }
    case 'INTERNSHIP': {
      return 'インターンシップ'
    }
    default: {
      return ''
    }
  }
}
