import { ApolloError } from '@apollo/client/core'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { masterSeminarDomainsQueries } from '$api/graphql/master-seminar-domains'

import { loading } from '$stores/app'
import { masterSeminarDomain } from '$stores/master-seminar-domains'

import apolloClient from '$lib/apollo'
import { MasterSeminarDomain } from '$lib/models'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()

  const storedMasterSeminarDomain = get(masterSeminarDomain)
  if (
    storedMasterSeminarDomain &&
    storedMasterSeminarDomain.id === Number(event.params.id)
  ) {
    return
  }

  loading.set(true)

  try {
    const result = await apolloClient.query({
      query: masterSeminarDomainsQueries.getMasterSeminarDomain,
      variables: {
        id: Number(event.params.id)
      },
      fetchPolicy: 'no-cache'
    })
    masterSeminarDomain.set(
      new MasterSeminarDomain(result.data.masterSeminarDomain)
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
