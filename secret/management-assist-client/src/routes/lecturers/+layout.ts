import { get } from 'svelte/store'

import { masterLecturerCategoriesQueries } from '$api/graphql/master-lecturer-categories'

import { loading } from '$stores/app'
import { masterLecturerCategories } from '$stores/master-lecturer-categories'

import apolloClient from '$lib/apollo'
import { MasterLecturerCategory } from '$lib/models'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()

  const storedMasterLecturerCategories = get(masterLecturerCategories)
  if (storedMasterLecturerCategories.length === 0) {
    loading.set(true)

    try {
      const result = await apolloClient.query({
        query: masterLecturerCategoriesQueries.getMasterLecturerCategories,
        fetchPolicy: 'no-cache'
      })
      masterLecturerCategories.set(
        result.data.masterLecturerCategories.map(
          (masterLecturerCategory: MasterLecturerCategory) =>
            new MasterLecturerCategory(masterLecturerCategory)
        )
      )
    } catch (e) {
      /* empty */
    } finally {
      loading.set(false)
    }
  }
}
