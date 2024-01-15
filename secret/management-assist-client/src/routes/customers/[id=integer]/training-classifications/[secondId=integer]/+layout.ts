import { ApolloError } from '@apollo/client/core'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { trainingClassificationsQueries } from '$api/graphql/training-classifications'

import { loading } from '$stores/app'
import { customer } from '$stores/customers'

import apolloClient from '$lib/apollo'
import { TrainingClassification } from '$lib/models'

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  await event.parent()
  event.depends('customer:trainingClassification')

  let trainingClassification: TrainingClassification
  loading.set(true)

  try {
    const result = await apolloClient.query({
      query: trainingClassificationsQueries.getTrainingClassification,
      variables: {
        id: Number(event.params.secondId)
      },
      fetchPolicy: 'no-cache'
    })
    trainingClassification = new TrainingClassification(
      result.data.trainingClassification
    )
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

  const storedCustomer = get(customer)
  const customerDetail = storedCustomer.customerDetails.find(
    (customerDetail) =>
      customerDetail.id === trainingClassification.customerDetailId
  )
  if (!customerDetail) {
    throw error(404)
  }

  return {
    trainingClassification,
    editable: storedCustomer.currentCustomerDetail?.id === customerDetail?.id
  }
}
