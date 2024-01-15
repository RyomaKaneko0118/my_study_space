import type { CreateTrainingClassificationCoordinatorInput } from '$api/graphql/training-classification-coordinators'
import type { CreateTrainingClassificationManagerInput } from '$api/graphql/training-classification-managers'

import type { TrainingClassificationType } from '$lib/models'

export type CreateTrainingClassificationInput = {
  customerDetailId: number
  departmentId?: number
  type: TrainingClassificationType
  trainingDays: number
  sales: number
  note: string
  createTrainingClassificationCoordinatorInputs?: CreateTrainingClassificationCoordinatorInput[]
  createTrainingClassificationManagerInputs?: CreateTrainingClassificationManagerInput[]
}

export type UpdateTrainingClassificationInput = {
  id: number
  departmentId?: number | null
  type?: TrainingClassificationType
  trainingDays?: number
  sales?: number
  note?: string
  createTrainingClassificationCoordinatorInputs?: CreateTrainingClassificationCoordinatorInput[]
  createTrainingClassificationManagerInputs?: CreateTrainingClassificationManagerInput[]
  deleteTrainingClassificationCoordinatorIds?: number[]
  deleteTrainingClassificationManagerIds?: number[]
}
