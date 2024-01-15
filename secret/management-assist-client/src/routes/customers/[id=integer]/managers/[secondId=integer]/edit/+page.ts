import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { customer } from '$stores/customers'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  await event.parent()

  const storedCustomer = get(customer)

  // NOTE: 顧客アーカイブ状態での担当者編集は不可
  if (storedCustomer.archived) {
    throw error(404)
  }
}
