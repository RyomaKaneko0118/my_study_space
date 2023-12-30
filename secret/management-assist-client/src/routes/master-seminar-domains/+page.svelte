<script lang="ts">
  import {
    faLayerGroup,
    faPlus,
    faSortDown,
    faSortUp,
    faSort
  } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import { masterSeminarDomainsQueries } from '$api/graphql/master-seminar-domains'

  import SearchForm from '$routes/master-seminar-domains/SearchForm.svelte'

  import { loading, serverError } from '$stores/app'
  import {
    masterSeminarDomains,
    pageInfo,
    filterAndSortArgs
  } from '$stores/master-seminar-domains'

  import apolloClient from '$lib/apollo'
  import { MasterSeminarDomain, type Edge } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonPagination from '$lib/components/CommonPagination.svelte'

  const onClickSort = (field: 'ID') => {
    $filterAndSortArgs = {
      ...$filterAndSortArgs,
      field,
      direction:
        $filterAndSortArgs.field !== field ||
        $filterAndSortArgs.direction !== 'ASC'
          ? 'ASC'
          : 'DESC'
    }
    fetchMasterSeminarDomains(1, true)
  }

  const onClickPage = (page: number) => {
    fetchMasterSeminarDomains(page)
  }

  const fetchMasterSeminarDomains = async (page = 1, forceLoading = false) => {
    if (forceLoading || $pageInfo?.currentPage !== page) {
      loading.set(true)
    }

    try {
      const result = await apolloClient.query({
        query: masterSeminarDomainsQueries.getMasterSeminarDomains,
        variables: {
          page,
          ...$filterAndSortArgs
        },
        fetchPolicy: 'no-cache'
      })
      masterSeminarDomains.set(
        result.data.masterSeminarDomains.edges.map(
          (edge: Edge) => new MasterSeminarDomain(edge.node)
        )
      )
      pageInfo.set(result.data.masterSeminarDomains.pageInfo)
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  onMount(() => {
    fetchMasterSeminarDomains($pageInfo?.currentPage)
  })
</script>

<svelte:head>
  <title>研修分野 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faLayerGroup} />
      <span class="ml-sm">研修分野</span>
    </h1>
    <div>
      <CommonButton
        variant="primary"
        size="sm"
        on:click={() => goto('/master-seminar-domains/new')}
      >
        <Fa icon={faPlus} />
        <span class="ml-xs">登録</span>
      </CommonButton>
    </div>
  </div>
  <div class="card p-md mt-md">
    <SearchForm on:search={() => fetchMasterSeminarDomains(1, true)} />
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
          <th>研修分野名</th>
          <th>担当講師</th>
        </tr>
      </thead>
      <tbody>
        {#each $masterSeminarDomains as masterSeminarDomain}
          <tr
            class="clickable hoverable"
            on:click={() =>
              goto(`/master-seminar-domains/${masterSeminarDomain.id}`)}
          >
            <th>{masterSeminarDomain.id}</th>
            <td>{masterSeminarDomain.name}</td>
            <td>{masterSeminarDomain.lecturers.length}人</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <CommonPagination
    pageInfo={$pageInfo}
    on:clickPage={(e) => onClickPage(e.detail)}
  />
</section>
