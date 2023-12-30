import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { customer } from '$stores/customers'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const data = await event.parent()

  const { editable } = data
  const storedCustomer = get(customer)

  // NOTE: currentCustomerDetailでない or 顧客アーカイブ状態での研修分類編集は不可
  if (!editable || storedCustomer.archived) {
    throw error(404)
  }
}
