import { get } from 'svelte/store'

import { managersQueries } from '$api/graphql/managers'

import { customer, refetchManagers } from '$stores/customers'

import apolloClient from '$lib/apollo'
import { Customer, Manager } from '$lib/models'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  await event.parent()

  if (!get(refetchManagers)) return

  // NOTE: 研修分類の担当変更に追従するため非同期で再取得
  const storedCustomer = get(customer)
  apolloClient
    .query({
      query: managersQueries.getManagers,
      variables: {
        customerId: storedCustomer.id
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      customer.set(
        new Customer({
          ...storedCustomer,
          managers: result.data.managers.map(
            (manager: Manager) => new Manager(manager)
          )
        })
      )
    })
    .catch((e) => {
      console.error(e)
    })
    .finally(() => {
      refetchManagers.set(false)
    })
}
