import {
  faSortDown,
  faPlus,
  faSort,
  faSortUp
} from '@fortawesome/free-solid-svg-icons'
import { onMount } from 'svelte'
import Fa from 'svelte-fa/src/fa.svelte'

import { goto } from '$app/navigation'

import { contractsQueries } from '$api/graphql/contracts'

import { loading, serverError } from '$stores/app'
import { pageInfo, filterAndSortArgs } from '$stores/contracts'
import { customer } from '$stores/customers'

import apolloClient from '$lib/apollo'
import type { Contract } from '$lib/models'

import CommonButton from '$lib/components/CommonButton.svelte'
import CommonPagination from '$lib/components/CommonPagination.svelte'

console.log('-----------------------------------')
console.log('check')
console.log($pageInfo)
let contracts: Contract[]
const onClickSort = (tmp) => {
  return
}
let notHoverable = false
const onClickPage = (page: number) => {
  fetchContracts(page)
}
const fetchContracts = async (page = 1, forceLoading = false) => {
  console.log('-----------------------------------')
  console.log('check2')
  if (forceLoading || $pageInfo?.currentPage !== page) {
    loading.set(true)
  }

  try {
    const result = await apolloClient.query({
      query: contractsQueries.getContracts,
      variables: {
        page,
        ...$filterAndSortArgs
      },
      fetchPolicy: 'no-cache'
    })
    console.log('-----------------------------------')
    console.log('check3')
    contracts = result.data.contracts.edge
    console.log(contracts)
    // contracts.set(
    //   result.data.contracts.edges.map((edge: Edge) => new contract(edge.node))
    // )
    pageInfo.set(result.data.contracts.pageInfo)
  } catch {
    serverError.set(true)
  } finally {
    loading.set(false)
  }
}
onMount(() => {
  console.log('-----------------------------------')
  console.log('check4')
  fetchContracts($pageInfo?.currentPage)
})