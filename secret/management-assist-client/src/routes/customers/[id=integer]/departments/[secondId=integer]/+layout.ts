import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { customer } from '$stores/customers'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()
  event.depends('customer:department')

  const storedCustomer = get(customer)
  const department = storedCustomer.departments.find(
    (department) => department.id === Number(event.params.secondId)
  )

  if (!department) {
    throw error(404)
  }

  return {
    department
  }
}
