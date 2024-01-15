import { writable } from 'svelte/store'

import type { MasterLecturerCategory } from '$lib/models'

export const masterLecturerCategories = writable<MasterLecturerCategory[]>([])
