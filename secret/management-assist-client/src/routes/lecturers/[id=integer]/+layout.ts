import { ApolloError } from '@apollo/client/core'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { lecturersQueries } from '$api/graphql/lecturers'

import { loading } from '$stores/app'
import { lecturer } from '$stores/lecturers'

import apolloClient from '$lib/apollo'
import { Lecturer } from '$lib/models'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()

  const storedLecturer = get(lecturer)
  if (storedLecturer && storedLecturer.id === Number(event.params.id)) {
    return
  }

  loading.set(true)

  try {
    const result = await apolloClient.query({
      query: lecturersQueries.getLecturer,
      variables: {
        id: Number(event.params.id)
      },
      fetchPolicy: 'no-cache'
    })
    lecturer.set(new Lecturer(result.data.lecturer))
  } catch (e) {
    if (e instanceof ApolloError) {
      const { graphQLErrors } = e
      if (graphQLErrors[0].extensions.code === 'NOT_FOUND') {
        throw error(404)
      }
    }
    throw error(500, String(e))
  } finally {
    loading.set(false)
  }
}
