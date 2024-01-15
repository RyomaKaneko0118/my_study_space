import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { lecturer } from '$stores/lecturers'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const data = await event.parent()
  const { lecturerContract } = data
  const storedLecturer = get(lecturer)

  // NOTE: 講師アーカイブ状態での契約編集は不可
  if (storedLecturer.archived || !lecturerContract) {
    throw error(404)
  }

  return {
    lecturerContract
  }
}
