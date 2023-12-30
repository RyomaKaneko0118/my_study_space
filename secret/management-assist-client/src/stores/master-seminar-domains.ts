import { writable } from 'svelte/store'

import type { MasterSeminarDomain, PageInfo } from '$lib/models'

// NOTE: /master-seminar-domains
export const masterSeminarDomains = writable<MasterSeminarDomain[]>([])
export const pageInfo = writable<PageInfo>()
export const filterAndSortArgs = writable<{
  name?: string
  field?: 'ID'
  direction?: 'ASC' | 'DESC'
}>({
  name: undefined,
  field: 'ID',
  direction: 'DESC'
})

// NOTE: /master-seminar-domains/[id=integer]/*
export const masterSeminarDomain = writable<MasterSeminarDomain>()
