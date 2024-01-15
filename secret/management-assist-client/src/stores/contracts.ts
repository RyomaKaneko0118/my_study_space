import { writable } from 'svelte/store'

import type { Contract, PageInfo } from '$lib/models'

// NOTE: /customers/[id=integer]/contracts
export const contracts = writable<Contract[]>([])
export const pageInfo = writable<PageInfo | undefined>()
export const filterAndSortArgs = writable<{
  includeOrigin?: boolean
  field?: 'ID' | 'DEPARTMENT' | 'START_DATE' | 'END_DATE' | 'TYPE' | 'STATUS'
  direction?: 'ASC' | 'DESC'
}>({
  includeOrigin: undefined,
  field: 'ID',
  direction: 'DESC'
})
