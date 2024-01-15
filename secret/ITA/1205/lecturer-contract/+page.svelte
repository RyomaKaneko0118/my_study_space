<script lang="ts">
  import { faPlus, faUser, faEdit } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { lecturer } from '$stores/lecturers'

  import CommonButton from '$lib/components/CommonButton.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  const { lecturerContract } = data

  $: statusDisplay = ''
  $: if (dayjs(lecturerContract?.startDate).isAfter(new Date(), 'day')) {
    statusDisplay = '未契約'
  } else if (dayjs(lecturerContract?.endDate).isBefore(new Date(), 'day')) {
    statusDisplay = '契約終了'
  } else {
    statusDisplay = '契約中'
  }
</script>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faUser} />
      <span class="ml-sm">{$lecturer.fullName}</span>
    </h1>
    <div class="d-flex ws-nowrap">
      {#if !lecturerContract}
        <CommonButton
          variant="primary"
          size="sm"
          on:click={() => {
            goto(`/lecturers/${$lecturer.id}/lecturer-contract/edit`)
          }}
        >
          <Fa icon={faEdit} />
          <span class="ml-xs">編集</span>
        </CommonButton>
      {:else}
        <CommonButton
          variant="primary"
          size="sm"
          on:click={() => {
            goto(`/lecturers/${$lecturer.id}/lecturer-contract/new`)
          }}
        >
          <Fa icon={faPlus} />
          <span class="ml-xs">登録</span>
        </CommonButton>
      {/if}
    </div>
  </div>
  {#if !lecturerContract}
    <div class="card my-md py-lg px-md">
      <div>
        {lecturerContract.id}
      </div>
      <div>
        {lecturerContract.lecturerId}
      </div>
      <div>
        {lecturerContract.type}
      </div>
      <div>
        {lecturerContract.contractorType}
      </div>
      <div>
        {lecturerContract.startDate}
      </div>
      <div>
        {lecturerContract.endDate}
      </div>
      <div>
        {statusDisplay}
      </div>
      <div>
        {lecturerContract.note}
      </div>
    </div>
  {:else}
    <h2 class="my-md">未登録</h2>
  {/if}
</section>
