import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { customer } from '$stores/customers'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const data = await event.parent()

  const { contract } = data
  const storedCustomer = get(customer)

  // NOTE: 契約中でない or 顧客アーカイブ状態での契約編集は不可
  if (contract.status !== 'DOING' || storedCustomer.archived) {
    throw error(404)
  }
}
