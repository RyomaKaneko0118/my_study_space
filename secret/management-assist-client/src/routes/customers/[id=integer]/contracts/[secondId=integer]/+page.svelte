<script lang="ts">
  import {
    faAngleLeft,
    faAngleRight,
    faEdit,
    faFilePdf,
    faTrash
  } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import Cookies from 'js-cookie'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import authAPI from '$api/auth'
  import fileAPI from '$api/file'
  import { contractsMutations } from '$api/graphql/contracts'

  import { loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import type { Contract } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: if (data) {
    contract = data.contract
  }

  $: department = $customer.departments.find(
    (department) => department.id === contract.departmentId
  )

  let contract: Contract
  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const onClickFile = async () => {
    loading.set(true)

    // NOTE: 強制的に認証情報をrefresh
    try {
      const cookie = Cookies.get('management-assist-session') as string
      const session = JSON.parse(decodeURIComponent(cookie))
      const refreshHeaders: { authorization: string } = {
        authorization: `Bearer ${session?.refreshToken}`
      }
      await authAPI.refresh(refreshHeaders)
    } catch (e) {
      console.error(e)
      loading.set(false)
      serverError.set(true)
      return
    }

    try {
      const cookie = Cookies.get('management-assist-session') as string
      const session = JSON.parse(decodeURIComponent(cookie))
      const response = await fileAPI.contractFile({
        id: contract.id,
        headers: {
          authorization: `Bearer ${session?.accessToken}`
        }
      })

      const virtualLink = document.createElement('a')
      virtualLink.href = URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      )
      virtualLink.download = contract.fileName as string
      virtualLink.click()
    } catch (e) {
      console.error(e)
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  const deleteContract = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation: contractsMutations.deleteContract,
        variables: {
          id: contract.id
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
        {#if contract.status === 'DOING'}
          <CommonButton
            variant="primary"
            size="sm"
            class="mr-sm"
            on:click={() => {
              goto(`/customers/${$customer.id}/contracts/${contract.id}/edit`)
            }}
          >
            <Fa icon={faEdit} />
            <span class="ml-xs">編集</span>
          </CommonButton>
        {/if}
        {#if !contract.originContract || !contract.updatedContract}
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
    {/if}
  </div>
  <div class="card my-md py-lg px-md">
    <table class="information">
      <tbody>
        <tr class="text-left">
          <th class="pr-md">ID</th>
          <td>{contract.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">契約名</th>
          <td>{contract.name}</td>
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
          <th class="pr-md">契約開始日</th>
          <td>{dayjs(contract.startDate).format('YYYY年MM月DD日')}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">契約終了日</th>
          <td>
            {#if contract.endDate}
              {dayjs(contract.endDate).format('YYYY年MM月DD日')}
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">ステータス</th>
          <td>
            <div class="default-badges-wrapper">
              <span
                class="badge {contract.status === 'DOING'
                  ? 'secondary'
                  : contract.status === 'ENDED'
                  ? 'danger'
                  : 'warning'}">{contract.statusLabel}</span
              >
              {#if contract.status !== 'DOING'}
                <span class="badge danger">編集不可</span>
              {/if}
              {#if contract.originContract && contract.updatedContract}
                <span class="badge danger">削除不可</span>
              {/if}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">契約書媒体</th>
          <td>{contract.typeLabel}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">契約書</th>
          <td>
            {#if contract.fileName}
              <button class="text-link hoverable" on:click={onClickFile}>
                <Fa icon={faFilePdf} />
                <span class="ml-xs">{contract.fileName}</span>
              </button>
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">自動更新</th>
          <td>
            <div class="default-badges-wrapper">
              {#if contract.status === 'UPDATED'}
                <span class="badge warning">更新済</span>
              {:else if contract.autoUpdate}
                <span class="badge secondary">有効</span>
              {:else}
                <span class="badge">無効</span>
              {/if}
              {#if contract.autoUpdate}
                <div>
                  <p>
                    {#if contract.endDate}
                      {dayjs(contract.endDate).format(
                        'YYYY年MM月DD日'
                      )}の契約満了後{contract.autoUpdateCountOfMonths}ヶ月更新
                    {/if}
                  </p>
                  {#if contract.status !== 'UPDATED'}
                    <p>
                      自動更新後契約終了日：{dayjs(contract.endDate)
                        .add(Number(contract.autoUpdateCountOfMonths), 'month')
                        .format('YYYY年MM月DD日')}
                    </p>
                  {/if}
                </div>
              {/if}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="d-flex justify-content-end">
    <div class="d-flex ws-nowrap">
      {#if contract.originContract}
        <CommonButton
          variant="primary"
          size="sm"
          class="mr-sm"
          outline
          on:click={() => {
            goto(
              `/customers/${$customer.id}/contracts/${contract.originContract?.id}`
            )
          }}
        >
          <Fa icon={faAngleLeft} />
          <span class="ml-xs">更新元契約を確認</span>
        </CommonButton>
      {/if}
      {#if contract.updatedContract}
        <CommonButton
          variant="primary"
          size="sm"
          outline
          on:click={() => {
            goto(
              `/customers/${$customer.id}/contracts/${contract.updatedContract?.id}`
            )
          }}
        >
          <span class="mr-xs">更新済契約を確認</span>
          <Fa icon={faAngleRight} />
        </CommonButton>
      {/if}
    </div>
  </div>
</section>

<CommonDeleteConfirmModal
  show={showDeleteConfirmModal}
  message="本当に{contract.name}を削除してもよろしいですか？"
  correctId={contract.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteContract}
/>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{contract.name}を削除しました。"
  on:close={() => goto(`/customers/${$customer.id}/contracts`)}
/>
