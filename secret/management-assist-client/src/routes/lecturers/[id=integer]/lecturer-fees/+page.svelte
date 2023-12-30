<script lang="ts">
  import { faUser, faEdit } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { lecturerFeesQueries } from '$api/graphql/lecturer-fees'

  import imgCrowdWorks from '$assets/images/crowd-works.png'

  import { loading, serverError } from '$stores/app'
  import { lecturer } from '$stores/lecturers'

  import apolloClient from '$lib/apollo'
  import { autoLink } from '$lib/auto-link'
  import { LecturerFee } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonTab from '$lib/components/CommonTab.svelte'

  $: if (currentLecturerDetail) {
    if (lecturerFeesByLecturerDetailId.has(currentLecturerDetail.id)) {
      currentLecturerFees =
        lecturerFeesByLecturerDetailId.get(currentLecturerDetail.id) || []
    } else {
      fetchLecturerFees()
    }
  }

  $: currentLecturerDetail =
    $lecturer.lecturerDetails[currentLecturerDetailTabIndex]

  let currentLecturerDetailTabIndex = 0
  let currentLecturerFees: LecturerFee[] = []

  const lecturerDetailTabItems = $lecturer.lecturerDetails.map(
    (lecturerDetail) => {
      return {
        label: String(lecturerDetail.financialYear)
      }
    }
  )

  const lecturerFeesByLecturerDetailId: Map<number, LecturerFee[]> = new Map()

  const fetchLecturerFees = async () => {
    loading.set(true)

    try {
      const result = await apolloClient.query({
        query: lecturerFeesQueries.getLecturerFees,
        variables: {
          lecturerDetailId: currentLecturerDetail.id
        },
        fetchPolicy: 'no-cache'
      })

      const fetchedLecturerFees = result.data.lecturerFees.map(
        (lecturerFee: LecturerFee) => new LecturerFee(lecturerFee)
      )
      lecturerFeesByLecturerDetailId.set(
        currentLecturerDetail.id,
        fetchedLecturerFees
      )
      currentLecturerFees = fetchedLecturerFees
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  onMount(fetchLecturerFees)
</script>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faUser} />
      <span class="ml-sm">{$lecturer.fullName}</span>
    </h1>
    {#if !$lecturer.archived}
      <div>
        <CommonButton
          variant="primary"
          size="sm"
          on:click={() => {
            goto(`/lecturers/${$lecturer.id}/lecturer-fees/edit`)
          }}
        >
          <Fa icon={faEdit} />
          <span class="ml-xs">編集</span>
        </CommonButton>
      </div>
    {/if}
  </div>
  <div class="mt-md mb-xs">
    <CommonTab
      items={lecturerDetailTabItems}
      bind:currentTabIndex={currentLecturerDetailTabIndex}
    />
  </div>
  {#each currentLecturerFees as lecturerFee}
    <div class="card mb-sm p-md d-flex justify-content-space-between">
      <table class="information">
        <tbody>
          <tr class="text-left">
            <th class="pr-md">ID</th>
            <td>{lecturerFee.id}</td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">区分</th>
            <td>{lecturerFee.label}</td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">講師料</th>
            <td>{lecturerFee.feeDisplay}</td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">時間単価</th>
            <td>{lecturerFee.feeByHourlyRateDisplay}</td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">メモ</th>
            <td class="ws-pre-wrap">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html autoLink(lecturerFee.note)}
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        {#if $lecturer.lecturerContract?.type === 'CROWDWORKS'}
          <img src={imgCrowdWorks} alt="CrowdWorks" class="crowd-works" />
        {/if}
      </div>
    </div>
  {/each}
</section>
