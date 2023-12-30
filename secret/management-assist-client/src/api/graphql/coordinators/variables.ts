import type { CoordinatorRole } from '$lib/models'

export type CreateCoordinatorInput = {
  saUserId: number
  role: CoordinatorRole
}
