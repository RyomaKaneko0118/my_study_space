import { get } from 'svelte/store'

import { lecturer } from '$stores/lecturers'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()
  event.depends('lecturer:lecturer-contract')

  const storedLecturer = get(lecturer)
  const lecturerContract = storedLecturer.lecturerContract
  return {
    lecturerContract
  }
}
