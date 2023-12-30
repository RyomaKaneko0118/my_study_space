import { writable } from 'svelte/store'

import type { Lecturer, PageInfo } from '$lib/models'

// NOTE: /lecturers
export const lecturers = writable<Lecturer[]>([])
export const pageInfo = writable<PageInfo>()
export const filterAndSortArgs = writable<{
  name?: string
  masterLecturerCategoryId?: number
  pinnedOnly?: boolean
  includeArchived?: boolean
  field?: 'ID'
  direction?: 'ASC' | 'DESC'
}>({
  name: undefined,
  masterLecturerCategoryId: undefined,
  pinnedOnly: undefined,
  includeArchived: undefined,
  field: 'ID',
  direction: 'DESC'
})

// NOTE: /lecturers/[id=integer]/*
export const lecturer = writable<Lecturer>()
