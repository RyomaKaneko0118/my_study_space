import { error } from '@sveltejs/kit'

import { clientsQueries } from '$api/graphql/clients'

import { loading } from '$stores/app'

import apolloClient from '$lib/apollo'
import { Client } from '$lib/models'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  await event.parent()

  let clients: Client[] = []

  loading.set(true)

  try {
    const result = await apolloClient.query({
      query: clientsQueries.getClients,
      fetchPolicy: 'no-cache'
    })
    clients = result.data.clients.map((client: Client) => new Client(client))
  } catch (e) {
    throw error(500, String(e))
  } finally {
    loading.set(false)
  }

  return {
    clients
  }
}
