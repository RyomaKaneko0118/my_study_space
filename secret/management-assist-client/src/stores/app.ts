import { writable } from 'svelte/store'

import type { Admin } from '$lib/models'

export const initialized = writable(false)
export const loading = writable(false)
export const serverError = writable(false)
export const breadcrumbName = writable('')
export const breadcrumbSecondName = writable('')
export const admins = writable<Admin[]>([])
