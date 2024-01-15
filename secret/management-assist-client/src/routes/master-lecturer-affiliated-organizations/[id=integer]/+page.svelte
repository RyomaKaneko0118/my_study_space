<script lang="ts">
  import {
    faEdit,
    faUserGroup,
    faTrash
  } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { masterLecturerAffiliatedOrganizationsMutations } from '$api/graphql/master-lecturer-affiliated-organizations'

  import { loading, serverError } from '$stores/app'
  import { masterLecturerAffiliatedOrganization } from '$stores/master-lecturer-affiliated-organizations'

  import apolloClient from '$lib/apollo'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const deleteMasterLecturerAffiliatedOrganization = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation:
          masterLecturerAffiliatedOrganizationsMutations.deleteMasterLecturerAffiliatedOrganization,
        variables: {
          id: $masterLecturerAffiliatedOrganization.id
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
    <h1 class="text-primary">
      <Fa icon={faUserGroup} />
      <span class="ml-sm">{$masterLecturerAffiliatedOrganization.name}</span>
    </h1>
    <div class="d-flex ws-nowrap">
      <CommonButton
        variant="primary"
        size="sm"
        class="mr-sm"
        on:click={() => {
          goto(
            `/master-lecturer-affiliated-organizations/${$masterLecturerAffiliatedOrganization.id}/edit`
          )
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
          <td>{$masterLecturerAffiliatedOrganization.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">組織名</th>
          <td>{$masterLecturerAffiliatedOrganization.name}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">代表者名</th>
          <td>{$masterLecturerAffiliatedOrganization.representativeName}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">代表者役職</th>
          <td>{$masterLecturerAffiliatedOrganization.representativePost}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">法人番号</th>
          <td>{$masterLecturerAffiliatedOrganization.corporateNumber ?? ''}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">適格請求書登録番号</th>
          <td>{$masterLecturerAffiliatedOrganization.invoiceNumber ?? ''}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">資本金</th>
          <td>{$masterLecturerAffiliatedOrganization.equityStockDisplay}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">リンク</th>
          <td>
            {#if $masterLecturerAffiliatedOrganization.link}
              <a
                href={$masterLecturerAffiliatedOrganization.link}
                target="_blank"
                class="text-link"
                >{$masterLecturerAffiliatedOrganization.link}</a
              >
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">電話番号</th>
          <td>{$masterLecturerAffiliatedOrganization.phoneNumber}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">住所</th>
          <td>
            {#if $masterLecturerAffiliatedOrganization.postalCode}
              <p>〒{$masterLecturerAffiliatedOrganization.postalCode}</p>
            {/if}
            <p>{$masterLecturerAffiliatedOrganization.fullAddress}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <h2 class="text-primary">
    所属講師({$masterLecturerAffiliatedOrganization.lecturers.length}人)
  </h2>
  <div class="table-wrapper mt-sm mb-md">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>氏名</th>
          <th>ビジネスネーム</th>
        </tr>
      </thead>
      <tbody>
        {#each $masterLecturerAffiliatedOrganization.lecturers as lecturer}
          <tr
            class="clickable hoverable"
            on:click={() => goto(`/lecturers/${lecturer.id}`)}
          >
            <th>{lecturer.id}</th>
            <td>{lecturer.fullName}</td>
            <td>{lecturer.businessName}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<CommonDeleteConfirmModal
  show={showDeleteConfirmModal}
  message="本当に{$masterLecturerAffiliatedOrganization.name}を削除してもよろしいですか？"
  correctId={$masterLecturerAffiliatedOrganization.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteMasterLecturerAffiliatedOrganization}
/>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{$masterLecturerAffiliatedOrganization.name}を削除しました。"
  on:close={() => goto('/master-lecturer-affiliated-organizations')}
/>
