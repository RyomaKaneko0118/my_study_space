<script lang="ts">
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { managersMutations } from '$api/graphql/managers'

  import { loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { autoLink } from '$lib/auto-link'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: department = $customer.departments.find(
    (department) => department.id === manager.departmentId
  )

  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const { manager } = data

  const deleteManager = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation: managersMutations.deleteManager,
        variables: {
          id: manager.id
        }
      })
      $customer.managers = $customer.managers.filter(
        (storedManager) => storedManager.id !== manager.id
      )
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
        <CommonButton
          variant="primary"
          size="sm"
          class="mr-sm"
          on:click={() => {
            goto(`/customers/${$customer.id}/managers/${manager.id}/edit`)
          }}
        >
          <Fa icon={faEdit} />
          <span class="ml-xs">編集</span>
        </CommonButton>
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
          <td>{manager.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">氏名</th>
          <td>{manager.fullName}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">氏名(かな)</th>
          <td>{manager.fullNameKana}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メールアドレス</th>
          <td>
            {#if manager.email}
              {manager.email}
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">担当開始年度</th>
          <td>{manager.startYear}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">担当終了年度</th>
          <td>
            {#if manager.endYear}
              {manager.endYear}
            {/if}
          </td>
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
          <th class="pr-md">職責</th>
          <td>{manager.post}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メイン担当研修</th>
          <td>
            <div class="default-badges-wrapper">
              {#each manager.mainTrainingClassifications as trainingClassification}
                {@const customerDetail = $customer.customerDetails.find(
                  (customerDetail) =>
                    customerDetail.id ===
                    trainingClassification.customerDetailId
                )}
                <span class="badge secondary"
                  >{customerDetail?.financialYear} / {trainingClassification.typeLabel}</span
                >
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">サブ担当研修</th>
          <td>
            <div class="default-badges-wrapper">
              {#each manager.subTrainingClassifications as trainingClassification}
                {@const customerDetail = $customer.customerDetails.find(
                  (customerDetail) =>
                    customerDetail.id ===
                    trainingClassification.customerDetailId
                )}
                <span class="badge primary"
                  >{customerDetail?.financialYear} / {trainingClassification.typeLabel}</span
                >
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">電話番号</th>
          <td>{manager.phoneNumber}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メモ</th>
          <td class="ws-pre-wrap">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html autoLink(manager.note)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<CommonDeleteConfirmModal
  show={showDeleteConfirmModal}
  message="本当に{manager.fullName}を削除してもよろしいですか？"
  correctId={manager.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteManager}
/>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{manager.fullName}を削除しました。"
  on:close={() => goto(`/customers/${$customer.id}/managers`)}
/>
