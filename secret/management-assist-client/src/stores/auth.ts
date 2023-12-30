import { writable } from 'svelte/store'

import type { Admin } from '$lib/models'

export const authenticatedAdmin = writable<Admin | null>(null)
