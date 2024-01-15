import { writable } from 'svelte/store'

import type { Customer, PageInfo } from '$lib/models'

// NOTE: /customers
export const customers = writable<Customer[]>([])
export const pageInfo = writable<PageInfo>()
export const filterAndSortArgs = writable<{
  name?: string
  coordinatorSaUserId?: number
  pinnedOnly?: boolean
  includeArchived?: boolean
  field?: 'ID' | 'SALES'
  direction?: 'ASC' | 'DESC'
}>({
  name: undefined,
  coordinatorSaUserId: undefined,
  pinnedOnly: undefined,
  includeArchived: undefined,
  field: 'ID',
  direction: 'DESC'
})

// NOTE: /customers/[id=integer]/*
export const customer = writable<Customer>()
export const refetchManagers = writable(false)
