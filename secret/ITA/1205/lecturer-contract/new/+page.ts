import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { lecturer } from '$stores/lecturers'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  await event.parent()

  const storedLecturer = get(lecturer)

  // NOTE: 講師アーカイブ状態での契約登録は不可
  if (storedLecturer.archived) {
    throw error(404)
  }
}
