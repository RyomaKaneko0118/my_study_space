import type { TrainingClassificationManagerRole } from '$lib/models'

export type CreateTrainingClassificationManagerInput = {
  managerId: number
  role: TrainingClassificationManagerRole
}
