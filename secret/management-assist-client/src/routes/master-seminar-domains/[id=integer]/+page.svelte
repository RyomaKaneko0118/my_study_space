<script lang="ts">
  import {
    faEdit,
    faLayerGroup,
    faTrash
  } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { masterSeminarDomainsMutations } from '$api/graphql/master-seminar-domains'

  import { loading, serverError } from '$stores/app'
  import { masterSeminarDomain } from '$stores/master-seminar-domains'

  import apolloClient from '$lib/apollo'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const deleteMasterSeminarDomain = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation: masterSeminarDomainsMutations.deleteMasterSeminarDomain,
        variables: {
          id: $masterSeminarDomain.id
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
      <Fa icon={faLayerGroup} />
      <span class="ml-sm">{$masterSeminarDomain.name}</span>
    </h1>
    <div class="d-flex ws-nowrap">
      <CommonButton
        variant="primary"
        size="sm"
        class="mr-sm"
        on:click={() => {
          goto(`/master-seminar-domains/${$masterSeminarDomain.id}/edit`)
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
          <td>{$masterSeminarDomain.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">研修分野名</th>
          <td>{$masterSeminarDomain.name}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <h2 class="text-primary">
    担当講師({$masterSeminarDomain.lecturers.length}人)
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
        {#each $masterSeminarDomain.lecturers as lecturer}
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
  message="本当に{$masterSeminarDomain.name}を削除してもよろしいですか？"
  correctId={$masterSeminarDomain.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteMasterSeminarDomain}
/>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{$masterSeminarDomain.name}を削除しました。"
  on:close={() => goto('/master-seminar-domains')}
/>
