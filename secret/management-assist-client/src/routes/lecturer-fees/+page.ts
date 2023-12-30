import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { lecturerDetailsQueries } from '$api/graphql/lecturer-details'

import { loading } from '$stores/app'
import { financialYears } from '$stores/lecturer-details'

import apolloClient from '$lib/apollo'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  await event.parent()

  const storedFinancialYears = get(financialYears)
  if (storedFinancialYears.length === 0) {
    loading.set(true)

    try {
      const result = await apolloClient.query({
        query: lecturerDetailsQueries.getLecturerDetailFinancialYears,
        fetchPolicy: 'no-cache'
      })
      financialYears.set(result.data.lecturerDetailFinancialYears)
    } catch (e) {
      throw error(500, String(e))
    } finally {
      loading.set(false)
    }
  }
}
