<script lang="ts">
  import { faCoins } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import { lecturerDetailsQueries } from '$api/graphql/lecturer-details'

  import imgCrowdWorks from '$assets/images/crowd-works.png'

  import SearchForm from '$routes/lecturer-fees/SearchForm.svelte'

  import { loading, serverError } from '$stores/app'
  import { filterArgs } from '$stores/lecturer-details'
  import { financialYears } from '$stores/lecturer-details'

  import apolloClient from '$lib/apollo'
  import { LecturerDetail } from '$lib/models'

  import CommonTab from '$lib/components/CommonTab.svelte'

  $: if (currentFinancialYear) {
    const fetched = lecturerDetailsByFinancialYear.get(currentFinancialYear)
    if (
      fetched &&
      fetched.filterArgs.name === $filterArgs.name &&
      fetched.filterArgs.includeArchived === $filterArgs.includeArchived
    ) {
      currentLecturerDetails = fetched.lecturerDetails || []
    } else {
      fetchLecturerDetails()
    }
  }

  $: currentFinancialYear = $financialYears[currentFinancialYearTabIndex]

  let currentFinancialYearTabIndex = 0
  let currentLecturerDetails: LecturerDetail[] = []

  const financialYearTabItems = $financialYears.map((financialYear) => {
    return {
      label: String(financialYear)
    }
  })

  const lecturerDetailsByFinancialYear: Map<
    number,
    {
      filterArgs: {
        name?: string
        includeArchived?: boolean
      }
      lecturerDetails: LecturerDetail[]
    }
  > = new Map()

  const fetchLecturerDetails = async () => {
    if (!currentFinancialYear) return

    loading.set(true)

    try {
      const result = await apolloClient.query({
        query: lecturerDetailsQueries.getLecturerDetails,
        variables: {
          ...$filterArgs,
          financialYear: currentFinancialYear
        },
        fetchPolicy: 'no-cache'
      })

      const fetchedLecturerDetails = result.data.lecturerDetails.map(
        (lecturerDetail: LecturerDetail) => new LecturerDetail(lecturerDetail)
      )
      lecturerDetailsByFinancialYear.set(currentFinancialYear, {
        filterArgs: { ...$filterArgs },
        lecturerDetails: fetchedLecturerDetails
      })
      currentLecturerDetails = fetchedLecturerDetails
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  onMount(fetchLecturerDetails)
</script>

<svelte:head>
  <title>講師料 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faCoins} />
      <span class="ml-sm">講師料</span>
    </h1>
  </div>
  <div class="card p-md mt-md">
    <SearchForm on:search={fetchLecturerDetails} />
  </div>
  <div class="mt-sm">
    <CommonTab
      items={financialYearTabItems}
      bind:currentTabIndex={currentFinancialYearTabIndex}
    />
  </div>
  <div class="table-wrapper mt-xs mb-md">
    <table class="table">
      <thead>
        <tr>
          <th>氏名</th>
          <th>ビジネスネーム</th>
          <th>区分</th>
          <th class="text-right">講師料</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each currentLecturerDetails as lecturerDetail}
          <tr
            class="clickable hoverable"
            on:click={() =>
              goto(`/lecturers/${lecturerDetail.lecturer?.id}/lecturer-fees`)}
          >
            <td>{lecturerDetail.lecturer?.fullName}</td>
            <td>{lecturerDetail.lecturer?.businessName}</td>
            <td>
              <div class="fees-warpper">
                {#each lecturerDetail.lecturerFees as lecturerFee}
                  <p>{lecturerFee.label}</p>
                {/each}
              </div>
            </td>
            <td class="text-right">
              <div class="fees-warpper">
                {#each lecturerDetail.lecturerFees as lecturerFee}
                  <p>{lecturerFee.feeDisplay}</p>
                {/each}
              </div>
            </td>
            <td class="text-right">
              {#if lecturerDetail.lecturer?.lecturerContract?.type === 'CROWDWORKS'}
                <img src={imgCrowdWorks} alt="CrowdWorks" class="crowd-works" />
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style lang="scss">
  .fees-warpper {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    gap: 5px;
  }
</style>
