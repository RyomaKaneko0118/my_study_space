import { ApolloError } from '@apollo/client/core'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { masterLecturerAffiliatedOrganizationsQueries } from '$api/graphql/master-lecturer-affiliated-organizations'

import { loading } from '$stores/app'
import { masterLecturerAffiliatedOrganization } from '$stores/master-lecturer-affiliated-organizations'

import apolloClient from '$lib/apollo'
import { MasterLecturerAffiliatedOrganization } from '$lib/models'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()

  const storedMasterLecturerAffiliatedOrganization = get(
    masterLecturerAffiliatedOrganization
  )
  if (
    storedMasterLecturerAffiliatedOrganization &&
    storedMasterLecturerAffiliatedOrganization.id === Number(event.params.id)
  ) {
    return
  }

  loading.set(true)

  try {
    const result = await apolloClient.query({
      query:
        masterLecturerAffiliatedOrganizationsQueries.getMasterLecturerAffiliatedOrganization,
      variables: {
        id: Number(event.params.id)
      },
      fetchPolicy: 'no-cache'
    })
    masterLecturerAffiliatedOrganization.set(
      new MasterLecturerAffiliatedOrganization(
        result.data.masterLecturerAffiliatedOrganization
      )
    )
  } catch (e) {
    if (e instanceof ApolloError) {
      const { graphQLErrors } = e
      if (graphQLErrors[0].extensions.code === 'NOT_FOUND') {
        throw error(404)
      }
    }
    throw error(500, String(e))
  } finally {
    loading.set(false)
  }
}
