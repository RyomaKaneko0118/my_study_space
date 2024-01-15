import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { lecturerFeesQueries } from '$api/graphql/lecturer-fees'

import { loading } from '$stores/app'
import { lecturer } from '$stores/lecturers'

import apolloClient from '$lib/apollo'
import { LecturerFee } from '$lib/models'

import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  await event.parent()

  const storedLecturer = get(lecturer)
  if (!storedLecturer.currentLecturerDetail) {
    throw error(500)
  }

  // NOTE: アーカイブ状態での編集は不可
  if (storedLecturer.archived) {
    throw error(404)
  }

  loading.set(true)

  try {
    const result = await apolloClient.query({
      query: lecturerFeesQueries.getLecturerFees,
      variables: {
        lecturerDetailId: storedLecturer.currentLecturerDetail.id
      },
      fetchPolicy: 'no-cache'
    })

    return {
      lecturerDetail: storedLecturer.currentLecturerDetail,
      lecturerFees: result.data.lecturerFees.map(
        (lecturerFee: LecturerFee) => new LecturerFee(lecturerFee)
      ) as LecturerFee[]
    }
  } catch (e) {
    throw error(500, String(e))
  } finally {
    loading.set(false)
  }
}
