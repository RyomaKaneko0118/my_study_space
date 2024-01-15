<script lang="ts">
  import { faUser, faEdit } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import imgCrowdWorks from '$assets/images/crowd-works.png'

  import { lecturer } from '$stores/lecturers'

  import { autoLink } from '$lib/auto-link'

  import CommonButton from '$lib/components/CommonButton.svelte'
</script>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faUser} />
      <span class="ml-sm">{$lecturer.fullName}</span>
    </h1>
    <div class="d-flex ws-nowrap">
      {#if $lecturer.lecturerContract && !$lecturer.archived}
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
      {/if}
    </div>
  </div>
  <div class="card my-md py-lg px-md">
    {#if $lecturer.lecturerContract}
      <table class="information">
        <tbody>
          <tr class="text-left">
            <th class="pr-md">ID</th>
            <td>{$lecturer.lecturerContract.id}</td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">名義</th>
            <td>{$lecturer.lecturerContract.contractorTypeLabel}</td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">契約開始日</th>
            <td
              >{dayjs($lecturer.lecturerContract.startDate).format(
                'YYYY年MM月DD日'
              )}</td
            >
          </tr>
          <tr class="text-left">
            <th class="pr-md">契約終了日</th>
            <td>
              {#if $lecturer.lecturerContract.endDate}
                {dayjs($lecturer.lecturerContract.endDate).format(
                  'YYYY年MM月DD日'
                )}
              {/if}
            </td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">契約形態</th>
            <td>
              {#if $lecturer.lecturerContract.type === 'CROWDWORKS'}
                <img src={imgCrowdWorks} alt="CrowdWorks" class="crowd-works" />
              {:else}
                {$lecturer.lecturerContract.typeLabel}
              {/if}
            </td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">契約状態</th>
            <td>
              <span
                class="badge {$lecturer.lecturerContract.isEnded
                  ? 'danger'
                  : 'secondary'}">{$lecturer.lecturerContract.statusLabel}</span
              >
            </td>
          </tr>
          <tr class="text-left">
            <th class="pr-md">メモ</th>
            <td class="ws-pre-wrap">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html autoLink($lecturer.lecturerContract.note)}
            </td>
          </tr>
        </tbody>
      </table>
    {:else}
      <div class="d-flex flex-direction-column align-items-center">
        <p class="fw-bold text-warning">契約が登録されていません</p>
        {#if !$lecturer.archived}
          <div class="mt-md default-btn-wrapper">
            <CommonButton
              variant="primary"
              size="sm"
              on:click={() =>
                goto(`/lecturers/${$lecturer.id}/lecturer-contract/new`)}
              >登録する
            </CommonButton>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
