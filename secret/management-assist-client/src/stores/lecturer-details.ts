import { writable } from 'svelte/store'

export const financialYears = writable<number[]>([])
export const filterArgs = writable<{
  name?: string
  includeArchived?: boolean
}>({
  name: undefined,
  includeArchived: undefined
})
