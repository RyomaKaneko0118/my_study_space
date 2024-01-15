<script lang="ts">
  import {
    faBoxArchive,
    faEdit,
    faTrash
  } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import {
    customersMutations,
    type UpdateCustomerInput
  } from '$api/graphql/customers'

  import { admins, loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { autoLink } from '$lib/auto-link'
  import { Customer } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonTab from '$lib/components/CommonTab.svelte'

  $: currentCustomerDetail =
    $customer.customerDetails[currentCustomerDetailTabIndex]
  $: customerDetailTabItems = $customer.customerDetails.map(
    (customerDetail) => {
      return {
        label: String(customerDetail.financialYear)
      }
    }
  )

  let currentCustomerDetailTabIndex = 0
  let showArchiveConfirmModalWithToState: boolean | null = null
  let showArchivedModalWithToState: boolean | null = null
  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const archiveCustomer = async (to: boolean) => {
    loading.set(true)

    const input: UpdateCustomerInput = {
      id: $customer.id,
      archived: to,
      updateCustomerDetailInput: {}
    }

    try {
      const result = await apolloClient.mutate({
        mutation: customersMutations.updateCustomer,
        variables: {
          updateCustomerInput: input
        }
      })
      customer.set(new Customer(result.data.updateCustomer))
      showArchivedModalWithToState = to
    } catch {
      serverError.set(true)
    } finally {
      showArchiveConfirmModalWithToState = null
      loading.set(false)
    }
  }

  const deleteCustomer = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation: customersMutations.deleteCustomer,
        variables: {
          id: $customer.id
        }
      })
      showDeleteConfirmModal = false
      showDeletedModal = true
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
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
    <div class="d-flex ws-nowrap">
      {#if !$customer.archived}
        <CommonButton
          variant="warning"
          size="sm"
          class="mr-sm"
          on:click={() => (showArchiveConfirmModalWithToState = true)}
        >
          <Fa icon={faBoxArchive} />
          <span class="ml-xs">アーカイブ</span>
        </CommonButton>
        <CommonButton
          variant="primary"
          size="sm"
          on:click={() => {
            goto(`/customers/${$customer.id}/edit`)
          }}
        >
          <Fa icon={faEdit} />
          <span class="ml-xs">編集</span>
        </CommonButton>
      {:else}
        <CommonButton
          variant="secondary"
          size="sm"
          class="mr-sm"
          on:click={() => (showArchiveConfirmModalWithToState = false)}
        >
          <Fa icon={faBoxArchive} />
          <span class="ml-xs">アーカイブ解除</span>
        </CommonButton>
        <CommonButton
          variant="danger"
          size="sm"
          on:click={() => (showDeleteConfirmModal = true)}
        >
          <Fa icon={faTrash} />
          <span class="ml-xs">削除</span>
        </CommonButton>
      {/if}
    </div>
  </div>
  <div class="card my-md py-lg px-md">
    <table class="information">
      <tbody>
        <tr class="text-left">
          <th class="pr-md">ID</th>
          <td>{$customer.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">board 顧客ID</th>
          <td>{$customer.boardClientId}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引開始日</th>
          <td>{dayjs($customer.dealingStartDate).format('YYYY年MM月DD日')}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引終了日</th>
          <td>
            {#if $customer.dealingEndDate}
              {dayjs($customer.dealingEndDate).format('YYYY年MM月DD日')}
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引年数</th>
          <td>{$customer.dealingPeriod}年</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">契約メモ</th>
          <td class="ws-pre-wrap">
            {@html autoLink($customer.contractNote)}
          </td>
        </tr>
      </tbody>
    </table>
    {#if $customer.archived}
      <span class="badge warning mt-md">アーカイブ済み</span>
    {/if}
  </div>
  <CommonTab
    items={customerDetailTabItems}
    bind:currentTabIndex={currentCustomerDetailTabIndex}
  />
  <div class="card mt-xs mb-md py-lg px-md">
    <table class="information">
      <tbody>
        <tr class="text-left">
          <th class="pr-md">名称</th>
          <td>{currentCustomerDetail.name}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">略称</th>
          <td>{currentCustomerDetail.nameDisp}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">住所</th>
          <td>
            {#if currentCustomerDetail.zip}
              <p>〒{currentCustomerDetail.zip}</p>
            {/if}
            <p>{currentCustomerDetail.addressDisplay}</p>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">リンク</th>
          <td>
            {#if currentCustomerDetail.link}
              <a
                href={currentCustomerDetail.link}
                target="_blank"
                class="text-link">{currentCustomerDetail.link}</a
              >
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">売上</th>
          <td class:text-warning={currentCustomerDetail.sales === null}
            >{currentCustomerDetail.salesDisplay}</td
          >
        </tr>
        <tr class="text-left">
          <th class="pr-md">親会社</th>
          <td class="ws-pre-wrap">
            {@html autoLink(currentCustomerDetail.parent)}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">関連会社</th>
          <td class="ws-pre-wrap">
            {@html autoLink(currentCustomerDetail.affiliate)}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メインコーディネーター</th>
          <td>
            <div class="default-badges-wrapper">
              {#each currentCustomerDetail.mainCoordinators as coordinator}
                {@const admin = $admins.find(
                  (admin) => admin.saUserId === coordinator.saUserId
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
              {#each currentCustomerDetail.subCoordinators as coordinator}
                {@const admin = $admins.find(
                  (admin) => admin.saUserId === coordinator.saUserId
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
          <th class="pr-md">メモ</th>
          <td class="ws-pre-wrap">
            {@html autoLink(currentCustomerDetail.note)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<CommonModal
  show={showArchiveConfirmModalWithToState !== null}
  title="確認"
  on:close={() => (showArchiveConfirmModalWithToState = null)}
>
  <div>
    {#if showArchiveConfirmModalWithToState}
      <p>
        本当に{$customer.currentCustomerDetail
          ?.name}をアーカイブしてもよろしいですか？
      </p>
      <p>アーカイブするとbordとの同期処理を停止します。</p>
    {:else}
      <p>
        本当に{$customer.currentCustomerDetail
          ?.name}のアーカイブを解除してもよろしいですか？
      </p>
      <p>アーカイブを解除するとbordとの同期処理を再開します。</p>
    {/if}
  </div>
  <div slot="footer" class="d-flex">
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton
        outline
        on:click={() => (showArchiveConfirmModalWithToState = null)}
        >キャンセル</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper">
      {#if showArchiveConfirmModalWithToState}
        <CommonButton variant="warning" on:click={() => archiveCustomer(true)}
          >アーカイブ</CommonButton
        >
      {:else}
        <CommonButton
          variant="secondary"
          on:click={() => archiveCustomer(false)}>アーカイブ解除</CommonButton
        >
      {/if}
    </div>
  </div>
</CommonModal>

<CommonDeleteConfirmModal
  show={showDeleteConfirmModal}
  message="本当に{$customer.currentCustomerDetail
    ?.name}を削除してもよろしいですか？"
  correctId={$customer.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteCustomer}
/>

<CommonModal
  show={showArchivedModalWithToState !== null}
  title="完了"
  on:close={() => (showArchivedModalWithToState = null)}
>
  {#if showArchivedModalWithToState}
    <p>{$customer.currentCustomerDetail?.name}をアーカイブしました。</p>
  {:else}
    <p>{$customer.currentCustomerDetail?.name}のアーカイブを解除しました。</p>
  {/if}
</CommonModal>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{$customer.currentCustomerDetail?.name}を削除しました。"
  on:close={() => goto('/customers')}
/>
