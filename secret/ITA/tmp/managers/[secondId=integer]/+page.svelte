<script lang="ts">
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  // import { managersMutations } from '$api/graphql/managers'

  import { loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const { manager } = data

  const deleteManager = async () => {
    loading.set(true)

    try {
      // await apolloClient.mutate({
      //   mutation: managersMutations.deleteManager,
      //   variables: {
      //     id: manager.id
      //   }
      // })
      // $customer.managers = $customer.managers.filter(
      //   (storedManager) => storedManager.id !== manager.id
      // )
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
  </div>
  <div class="card my-md py-lg px-md">
    <table class="information">
      <tbody>
        <tr class="text-left">
          <th class="pr-md">ID</th>
          <td>{manager.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">氏</th>
          <td>{manager.lastName}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">名</th>
          <td>{manager.firstName}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">氏(フリガナ)</th>
          <td>{manager.lastNameKana}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">名(フリガナ)</th>
          <td>{manager.firstNameKana}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">担当開始年度</th>
          <td>{manager.startYear}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">部門名</th>
          <td>ToDo {$customer.departments[0].name}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引開始日</th>
          <td>{manager.startYear}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引終了日</th>
          <td>
            {#if manager.endYear}
              {manager.endYear}
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">取引年数</th>
          <td>ToDo</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">住所</th>
          <td>
            <p>Todo</p>
            <p>Todo</p>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">担当者</th>
          <td>TODO</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メモ</th>
          <td class="ws-pre-wrap">{manager.note}</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<CommonModal
  show={showDeleteConfirmModal}
  title="確認"
  message="本当に{manager.fullName}を削除してもよろしいですか？"
  on:close={() => (showDeleteConfirmModal = false)}
>
  <div slot="footer" class="d-flex">
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton outline on:click={() => (showDeleteConfirmModal = false)}
        >キャンセル</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper">
      <CommonButton variant="danger" on:click={deleteManager}>削除</CommonButton
      >
    </div>
  </div>
</CommonModal>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{manager.fullName}を削除しました。"
  on:close={() => goto(`/customers/${$customer.id}/managers`)}
/>
