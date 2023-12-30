<script lang="ts">
  import {
    faSortDown,
    faPlus,
    faSort,
    faSortUp
  } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { contractsQueries } from '$api/graphql/contracts'

  import SearchForm from '$routes/customers/[id=integer]/contracts/SearchForm.svelte'

  import { loading, serverError } from '$stores/app'
  import { contracts, pageInfo, filterAndSortArgs } from '$stores/contracts'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { autoLink } from '$lib/auto-link'
  import { Contract, type Edge } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonPagination from '$lib/components/CommonPagination.svelte'

  const onClickSort = (
    field: 'ID' | 'DEPARTMENT' | 'START_DATE' | 'END_DATE' | 'TYPE' | 'STATUS'
  ) => {
    $filterAndSortArgs = {
      ...$filterAndSortArgs,
      field,
      direction:
        $filterAndSortArgs.field !== field ||
        $filterAndSortArgs.direction !== 'ASC'
          ? 'ASC'
          : 'DESC'
    }
    fetchContracts(1, true)
  }

  const onClickPage = (page: number) => {
    fetchContracts(page)
  }

  const fetchContracts = async (page = 1, forceLoading = false) => {
    if (forceLoading || $pageInfo?.currentPage !== page) {
      loading.set(true)
    }

    try {
      const result = await apolloClient.query({
        query: contractsQueries.getContracts,
        variables: {
          customerId: $customer.id,
          page,
          ...$filterAndSortArgs
        },
        fetchPolicy: 'no-cache'
      })
      contracts.set(
        result.data.contracts.edges.map((edge: Edge) => new Contract(edge.node))
      )
      pageInfo.set(result.data.contracts.pageInfo)
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  onMount(() => {
    fetchContracts($pageInfo?.currentPage)
  })
</script>

<section class="content">
  <div class="d-flex justify-content-space-between">
    {#if $customer.logoUrl}
      <img
        src={$customer.logoUrl}
        alt={$customer.currentCustomerDetail?.name}
        class="customer-logo mt-auto"
      />
    {:else}
      <h1 class="text-primary">{$customer.currentCustomerDetail?.name}</h1>
    {/if}
    {#if !$customer.archived}
      <div>
        <CommonButton
          variant="primary"
          size="sm"
          on:click={() => goto(`/customers/${$customer.id}/contracts/new`)}
        >
          <Fa icon={faPlus} />
          <span class="ml-xs">登録</span>
        </CommonButton>
      </div>
    {/if}
  </div>
  {#if $customer.contractNote}
    <div class="card p-md mt-md fs-sm">
      <p class="text-gray fw-bold">契約メモ</p>
      <p class="mt-sm ml-xs ws-pre-wrap">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html autoLink($customer.contractNote)}
      </p>
    </div>
  {/if}
  <div class="card p-md mt-md">
    <SearchForm on:search={() => fetchContracts(1, true)} />
  </div>
  <div class="table-wrapper mt-sm mb-md">
    <table class="table">
      <thead>
        <tr>
          <th class="clickable" on:click={() => onClickSort('ID')}>
            <span>ID</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'ID'}
            >
              {#if $filterAndSortArgs.field === 'ID'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th>契約名</th>
          <th class="clickable" on:click={() => onClickSort('DEPARTMENT')}>
            <span>部門</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'DEPARTMENT'}
            >
              {#if $filterAndSortArgs.field === 'DEPARTMENT'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th class="clickable" on:click={() => onClickSort('START_DATE')}>
            <span>契約開始日</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'START_DATE'}
            >
              {#if $filterAndSortArgs.field === 'START_DATE'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th class="clickable" on:click={() => onClickSort('END_DATE')}>
            <span>契約終了日</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'END_DATE'}
            >
              {#if $filterAndSortArgs.field === 'END_DATE'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th class="clickable" on:click={() => onClickSort('STATUS')}>
            <span>ステータス</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'STATUS'}
            >
              {#if $filterAndSortArgs.field === 'STATUS'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th class="clickable" on:click={() => onClickSort('TYPE')}>
            <span>契約書媒体</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'TYPE'}
            >
              {#if $filterAndSortArgs.field === 'TYPE'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each $contracts as contract}
          {@const department = $customer.departments.find(
            (department) => department.id === contract.departmentId
          )}
          <tr
            class="clickable hoverable"
            on:click={() =>
              goto(`/customers/${$customer.id}/contracts/${contract.id}`)}
          >
            <th>{contract.id}</th>
            <td>{contract.name}</td>
            <td>{department?.name || '本社'}</td>
            <td>{dayjs(contract.startDate).format('YYYY年MM月DD日')}</td>
            <td>
              {#if contract.endDate}
                {dayjs(contract.endDate).format('YYYY年MM月DD日')}
              {/if}
            </td>
            <td>
              <span
                class="badge {contract.status === 'DOING'
                  ? 'secondary'
                  : contract.status === 'ENDED'
                  ? 'danger'
                  : 'warning'}">{contract.statusLabel}</span
              >
            </td>
            <td>{contract.typeLabel}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if $pageInfo}
    <CommonPagination
      pageInfo={$pageInfo}
      on:clickPage={(e) => onClickPage(e.detail)}
    />
  {/if}
</section>
