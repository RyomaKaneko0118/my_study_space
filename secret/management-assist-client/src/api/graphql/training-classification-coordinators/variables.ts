import type { TrainingClassificationCoordinatorRole } from '$lib/models'

export type CreateTrainingClassificationCoordinatorInput = {
  coordinatorId: number
  role: TrainingClassificationCoordinatorRole
}
