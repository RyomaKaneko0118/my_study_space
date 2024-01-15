import { ApolloError } from '@apollo/client/core'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { contractsQueries } from '$api/graphql/contracts'

import { loading } from '$stores/app'
import { customer } from '$stores/customers'

import apolloClient from '$lib/apollo'
import { Contract } from '$lib/models'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()
  event.depends('customer:contract')

  let contract: Contract
  loading.set(true)

  try {
    const result = await apolloClient.query({
      query: contractsQueries.getContract,
      variables: {
        id: Number(event.params.secondId)
      },
      fetchPolicy: 'no-cache'
    })
    contract = new Contract(result.data.contract)
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

  const storedCustomer = get(customer)
  if (contract.customerId !== storedCustomer.id) {
    throw error(404)
  }

  return {
    contract
  }
}
