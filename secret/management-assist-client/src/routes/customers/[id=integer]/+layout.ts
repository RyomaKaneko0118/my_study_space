import { ApolloError } from '@apollo/client/core'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { customersQueries } from '$api/graphql/customers'

import { loading } from '$stores/app'
import { contracts, pageInfo, filterAndSortArgs } from '$stores/contracts'
import { customer, refetchManagers } from '$stores/customers'

import apolloClient from '$lib/apollo'
import { Customer } from '$lib/models'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()

  const storedCustomer = get(customer)
  if (storedCustomer && storedCustomer.id === Number(event.params.id)) {
    return
  }

  loading.set(true)

  // NOTE: 契約一覧のリセット
  contracts.set([])
  pageInfo.set(undefined)
  filterAndSortArgs.set({})

  // NOTE: 担当者一覧再取得フラグのリセット
  refetchManagers.set(false)

  try {
    const result = await apolloClient.query({
      query: customersQueries.getCustomer,
      variables: {
        id: Number(event.params.id)
      },
      fetchPolicy: 'no-cache'
    })
    customer.set(new Customer(result.data.customer))
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
