<script lang="ts">
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { trainingClassificationsMutations } from '$api/graphql/training-classifications'

  import { admins, loading, serverError } from '$stores/app'
  import { customer, refetchManagers } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { autoLink } from '$lib/auto-link'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: department = $customer.departments.find(
    (department) => department.id === trainingClassification.departmentId
  )

  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const { trainingClassification, editable } = data

  const deleteTrainingClassification = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation: trainingClassificationsMutations.deleteTrainingClassification,
        variables: {
          id: trainingClassification.id
        }
      })
      refetchManagers.set(true)
      showDeleteConfirmModal = false
      showDeletedModal = true
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }
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
      <div class="d-flex ws-nowrap">
        {#if editable}
          <CommonButton
            variant="primary"
            size="sm"
            class="mr-sm"
            on:click={() => {
              goto(
                `/customers/${$customer.id}/training-classifications/${trainingClassification.id}/edit`
              )
            }}
          >
            <Fa icon={faEdit} />
            <span class="ml-xs">編集</span>
          </CommonButton>
        {/if}
        <CommonButton
          variant="danger"
          size="sm"
          on:click={() => (showDeleteConfirmModal = true)}
        >
          <Fa icon={faTrash} />
          <span class="ml-xs">削除</span>
        </CommonButton>
      </div>
    {/if}
  </div>
  <div class="card my-md py-lg px-md">
    <table class="information">
      <tbody>
        <tr class="text-left">
          <th class="pr-md">ID</th>
          <td>{trainingClassification.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">研修分類</th>
          <td>{trainingClassification.typeLabel}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">部門</th>
          <td>
            {#if department}
              <a
                href="/customers/{$customer.id}/departments/{department.id}"
                class="underline">{department.name}</a
              >
            {:else}
              <span>本社</span>
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">研修日数</th>
          <td>{trainingClassification.trainingDays}日</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">売上</th>
          <td>¥{trainingClassification.sales.toLocaleString()}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メインコーディネーター</th>
          <td>
            <div class="default-badges-wrapper">
              {#each trainingClassification.mainCoordinators as mainCoordinator}
                {@const admin = $admins.find(
                  (admin) => admin.saUserId === mainCoordinator.saUserId
                )}
                {#if admin}
                  <span class="badge secondary">{admin?.displayName}</span>
                {:else}
                  <span class="badge warning">不明</span>
                {/if}
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">サブコーディネーター</th>
          <td>
            <div class="default-badges-wrapper">
              {#each trainingClassification.subCoordinators as subCoordinator}
                {@const admin = $admins.find(
                  (admin) => admin.saUserId === subCoordinator.saUserId
                )}
                {#if admin}
                  <span class="badge primary">{admin?.displayName}</span>
                {:else}
                  <span class="badge warning">不明</span>
                {/if}
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メイン担当者</th>
          <td>
            <div class="default-badges-wrapper">
              {#each trainingClassification.mainManagers as mainManager}
                <span class="badge secondary">{mainManager.fullName}</span>
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">サブ担当者</th>
          <td>
            <div class="default-badges-wrapper">
              {#each trainingClassification.subManagers as mainManager}
                <span class="badge primary">{mainManager.fullName}</span>
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メモ</th>
          <td class="ws-pre-wrap">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html autoLink(trainingClassification.note)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<CommonDeleteConfirmModal
  show={showDeleteConfirmModal}
  message="本当に{trainingClassification.typeLabel}を削除してもよろしいですか？"
  correctId={trainingClassification.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteTrainingClassification}
/>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{trainingClassification.typeLabel}を削除しました。"
  on:close={() => goto(`/customers/${$customer.id}/training-classifications`)}
/>
