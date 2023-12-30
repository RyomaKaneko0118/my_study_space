import { writable } from 'svelte/store'

import type {
  MasterLecturerAffiliatedOrganization,
  PageInfo
} from '$lib/models'

// NOTE: /master-lecturer-affiliated-organizations
export const masterLecturerAffiliatedOrganizations = writable<
  MasterLecturerAffiliatedOrganization[]
>([])
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

// NOTE: /master-lecturer-affiliated-organizations/[id=integer]/*
export const masterLecturerAffiliatedOrganization =
  writable<MasterLecturerAffiliatedOrganization>()
