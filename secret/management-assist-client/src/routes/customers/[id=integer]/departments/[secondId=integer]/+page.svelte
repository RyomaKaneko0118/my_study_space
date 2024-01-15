<script lang="ts">
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { departmentsMutations } from '$api/graphql/departments'

  import { loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { autoLink } from '$lib/auto-link'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const { department } = data

  const deleteDepartment = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation: departmentsMutations.deleteDepartment,
        variables: {
          id: department.id
        }
      })
      $customer.departments = $customer.departments.filter(
        (storedDepartment) => storedDepartment.id !== department.id
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
            goto(`/customers/${$customer.id}/departments/${department.id}/edit`)
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
          <td>{department.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">部門名</th>
          <td>{department.name}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引開始日</th>
          <td>{dayjs(department.dealingStartDate).format('YYYY年MM月DD日')}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引終了日</th>
          <td>
            {#if department.dealingEndDate}
              {dayjs(department.dealingEndDate).format('YYYY年MM月DD日')}
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引年数</th>
          <td>{department.dealingPeriod}年</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">住所</th>
          <td>
            {#if department.postalCode}
              <p>〒{department.postalCode}</p>
            {/if}
            <p>{department.fullAddress}</p>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">担当者</th>
          <td>
            <div class="default-badges-wrapper">
              {#each $customer.managers as manager}
                {#if department.id === manager.departmentId}
                  <span class="badge">{manager.fullName}</span>
                {/if}
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メモ</th>
          <td class="ws-pre-wrap">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html autoLink(department.note)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<CommonDeleteConfirmModal
  show={showDeleteConfirmModal}
  message="本当に{department.name}を削除してもよろしいですか？"
  correctId={department.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteDepartment}
/>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{department.name}を削除しました。"
  on:close={() => goto(`/customers/${$customer.id}/departments`)}
/>
