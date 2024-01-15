<script lang="ts">
  import {
    faUserGroup,
    faPlus,
    faSortDown,
    faSortUp,
    faSort
  } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import { masterLecturerAffiliatedOrganizationsQueries } from '$api/graphql/master-lecturer-affiliated-organizations'

  import SearchForm from '$routes/master-lecturer-affiliated-organizations/SearchForm.svelte'

  import { loading, serverError } from '$stores/app'
  import {
    masterLecturerAffiliatedOrganizations,
    pageInfo,
    filterAndSortArgs
  } from '$stores/master-lecturer-affiliated-organizations'

  import apolloClient from '$lib/apollo'
  import { MasterLecturerAffiliatedOrganization, type Edge } from '$lib/models'

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
    fetchMasterLecturerAffiliatedOrganizations(1, true)
  }

  const onClickPage = (page: number) => {
    fetchMasterLecturerAffiliatedOrganizations(page)
  }

  const fetchMasterLecturerAffiliatedOrganizations = async (
    page = 1,
    forceLoading = false
  ) => {
    if (forceLoading || $pageInfo?.currentPage !== page) {
      loading.set(true)
    }

    try {
      const result = await apolloClient.query({
        query:
          masterLecturerAffiliatedOrganizationsQueries.getMasterLecturerAffiliatedOrganizations,
        variables: {
          page,
          ...$filterAndSortArgs
        },
        fetchPolicy: 'no-cache'
      })
      masterLecturerAffiliatedOrganizations.set(
        result.data.masterLecturerAffiliatedOrganizations.edges.map(
          (edge: Edge) => new MasterLecturerAffiliatedOrganization(edge.node)
        )
      )
      pageInfo.set(result.data.masterLecturerAffiliatedOrganizations.pageInfo)
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  onMount(() => {
    fetchMasterLecturerAffiliatedOrganizations($pageInfo?.currentPage)
  })
</script>

<svelte:head>
  <title>所属組織 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faUserGroup} />
      <span class="ml-sm">所属組織</span>
    </h1>
    <div>
      <CommonButton
        variant="primary"
        size="sm"
        on:click={() => goto('/master-lecturer-affiliated-organizations/new')}
      >
        <Fa icon={faPlus} />
        <span class="ml-xs">登録</span>
      </CommonButton>
    </div>
  </div>
  <div class="card p-md mt-md">
    <SearchForm
      on:search={() => fetchMasterLecturerAffiliatedOrganizations(1, true)}
    />
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
          <th>組織名</th>
          <th>代表者名</th>
          <th>法人番号</th>
          <th>所属講師</th>
        </tr>
      </thead>
      <tbody>
        {#each $masterLecturerAffiliatedOrganizations as masterLecturerAffiliatedOrganization}
          <tr
            class="clickable hoverable"
            on:click={() =>
              goto(
                `/master-lecturer-affiliated-organizations/${masterLecturerAffiliatedOrganization.id}`
              )}
          >
            <th>{masterLecturerAffiliatedOrganization.id}</th>
            <td>{masterLecturerAffiliatedOrganization.name}</td>
            <td>{masterLecturerAffiliatedOrganization.representativeName}</td>
            <td>
              {masterLecturerAffiliatedOrganization.corporateNumber ?? ''}
            </td>
            <td>{masterLecturerAffiliatedOrganization.lecturers.length}人</td>
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
