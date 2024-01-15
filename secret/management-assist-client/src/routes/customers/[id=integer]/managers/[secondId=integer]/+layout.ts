import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { customer } from '$stores/customers'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()
  event.depends('customer:manager')

  const storedCustomer = get(customer)
  const manager = storedCustomer.managers.find(
    (manager) => manager.id === Number(event.params.secondId)
  )

  if (!manager) {
    throw error(404)
  }

  return {
    manager
  }
}
