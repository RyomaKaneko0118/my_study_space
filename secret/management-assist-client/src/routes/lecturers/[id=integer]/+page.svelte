<script lang="ts">
  import {
    faUser,
    faBoxArchive,
    faEdit,
    faTrash
  } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import {
    lecturersMutations,
    type UpdateLecturerInput
  } from '$api/graphql/lecturers'

  import imgFileBlank from '$assets/images/file-blank.png'

  import { loading, serverError } from '$stores/app'
  import { lecturer } from '$stores/lecturers'

  import apolloClient from '$lib/apollo'
  import { autoLink } from '$lib/auto-link'
  import { Lecturer } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonDeleteConfirmModal from '$lib/components/CommonDeleteConfirmModal.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  let showArchiveConfirmModalWithToState: boolean | null = null
  let showArchivedModalWithToState: boolean | null = null
  let showDeleteConfirmModal = false
  let showDeletedModal = false

  const archiveLecturer = async (to: boolean) => {
    loading.set(true)

    const input: UpdateLecturerInput = {
      id: $lecturer.id,
      archived: to
    }

    try {
      const result = await apolloClient.mutate({
        mutation: lecturersMutations.updateLecturer,
        variables: {
          updateLecturerInput: input
        }
      })
      lecturer.set(new Lecturer(result.data.updateLecturer))
      showArchivedModalWithToState = to
    } catch {
      serverError.set(true)
    } finally {
      showArchiveConfirmModalWithToState = null
      loading.set(false)
    }
  }

  const deleteLecturer = async () => {
    loading.set(true)

    try {
      await apolloClient.mutate({
        mutation: lecturersMutations.deleteLecturer,
        variables: {
          id: $lecturer.id
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
      <Fa icon={faUser} />
      <span class="ml-sm">{$lecturer.fullName}</span>
    </h1>
    <div class="d-flex ws-nowrap">
      {#if !$lecturer.archived}
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
            goto(`/lecturers/${$lecturer.id}/edit`)
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
    <div class="image-wrapper mb-md" class:blank={!$lecturer.imageUrl}>
      <img src={$lecturer.imageUrl || imgFileBlank} alt={$lecturer.fullName} />
    </div>
    <table class="information">
      <tbody>
        <tr class="text-left">
          <th class="pr-md">ID</th>
          <td>{$lecturer.id}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">氏名</th>
          <td>{$lecturer.fullName}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">氏名(かな)</th>
          <td>{$lecturer.fullNameKana}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">ビジネスネーム</th>
          <td>{$lecturer.businessName}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">ビジネスネーム(かな)</th>
          <td>{$lecturer.bussinessNameKana}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">所属組織</th>
          <td>
            {#if $lecturer.masterLecturerAffiliatedOrganization}
              <a
                href="/master-lecturer-affiliated-organizations/{$lecturer
                  .masterLecturerAffiliatedOrganization.id}"
                class="underline"
                >{$lecturer.masterLecturerAffiliatedOrganization.name}</a
              >
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メールアドレス</th>
          <td>
            <div class="contacts-wrapper">
              {#each $lecturer.lecturerContactsOfEmail as lecturerContact}
                <div class="d-flex">
                  <span class="badge mr-sm">{lecturerContact.label}</span>
                  <p>{lecturerContact.value}</p>
                </div>
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">電話番号</th>
          <td>
            <div class="contacts-wrapper">
              {#each $lecturer.lecturerContactsOfPhone as lecturerContact}
                <div class="d-flex">
                  <span class="badge mr-sm">{lecturerContact.label}</span>
                  <p>{lecturerContact.value}</p>
                </div>
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">緊急連絡先</th>
          <td>
            <div class="contacts-wrapper">
              {#each $lecturer.lecturerEmergencyContacts as lecturerEmergencyContact}
                <div class="d-flex">
                  <span class="badge mr-sm"
                    >{lecturerEmergencyContact.name}({lecturerEmergencyContact.relationship})</span
                  >
                  <p>{lecturerEmergencyContact.phoneNumber}</p>
                </div>
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">担当領域</th>
          <td>
            <div class="default-badges-wrapper">
              {#each $lecturer.masterLecturerCategories as masterLecturerCategory}
                <span class="badge">{masterLecturerCategory.name}</span>
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">研修分野</th>
          <td>
            <div class="default-badges-wrapper">
              {#each $lecturer.masterSeminarDomains as masterSeminarDomain}
                <span class="badge">{masterSeminarDomain.name}</span>
              {/each}
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">役割</th>
          <td>
            <div class="default-badges-wrapper">
              <span
                class="badge"
                class:secondary={$lecturer.role === 'MAIN'}
                class:primary={$lecturer.role === 'SUB'}
                >{$lecturer.roleLabel}</span
              >
            </div>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">資料送付先</th>
          <td>{$lecturer.sendDocumentAddressTypeLabel}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">ALL ML</th>
          <td>{$lecturer.isJoinedMailingList ? '参加' : '不参加'}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">教材開発レビュー</th>
          <td>{$lecturer.isAvailableReviewTeachingMaterial ? '可' : '不可'}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">交通費</th>
          <td>{$lecturer.transportationExpensesDisplay}</td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">
            <p>覚書確認日</p>
            <p>(個人情報取扱)</p>
          </th>
          <td>
            {#if $lecturer.privacyPolicyMemorandumConfirmedDate}
              {dayjs($lecturer.privacyPolicyMemorandumConfirmedDate).format(
                'YYYY年MM月DD日'
              )}
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">
            <p>同意日</p>
            <p>(個人情報取扱)</p>
          </th>
          <td>
            {#if $lecturer.privacyPolicyAgreedDate}
              {dayjs($lecturer.privacyPolicyAgreedDate).format(
                'YYYY年MM月DD日'
              )}
            {/if}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">住所</th>
          <td>
            {#if $lecturer.postalCode}
              <p>〒{$lecturer.postalCode}</p>
            {/if}
            <p>{$lecturer.fullAddress}</p>
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">教材実績メモ</th>
          <td class="ws-pre-wrap">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html autoLink($lecturer.teachingMaterialAchivementsNote)}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">依頼時の注意点</th>
          <td class="ws-pre-wrap">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html autoLink($lecturer.attentionNote)}
          </td>
        </tr>
        <tr class="text-left">
          <th class="pr-md">メモ</th>
          <td class="ws-pre-wrap">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html autoLink($lecturer.note)}
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
        本当に{$lecturer.fullName}をアーカイブしてもよろしいですか？
      </p>
    {:else}
      <p>
        本当に{$lecturer.fullName}のアーカイブを解除してもよろしいですか？
      </p>
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
        <CommonButton variant="warning" on:click={() => archiveLecturer(true)}
          >アーカイブ</CommonButton
        >
      {:else}
        <CommonButton
          variant="secondary"
          on:click={() => archiveLecturer(false)}>アーカイブ解除</CommonButton
        >
      {/if}
    </div>
  </div>
</CommonModal>

<CommonDeleteConfirmModal
  show={showDeleteConfirmModal}
  message="本当に{$lecturer.fullName}を削除してもよろしいですか？"
  correctId={$lecturer.id}
  on:close={() => (showDeleteConfirmModal = false)}
  on:submit={deleteLecturer}
/>

<CommonModal
  show={showArchivedModalWithToState !== null}
  title="完了"
  on:close={() => (showArchivedModalWithToState = null)}
>
  {#if showArchivedModalWithToState}
    <p>{$lecturer.fullName}をアーカイブしました。</p>
  {:else}
    <p>{$lecturer.fullName}のアーカイブを解除しました。</p>
  {/if}
</CommonModal>

<CommonModal
  show={showDeletedModal}
  title="完了"
  message="{$lecturer.fullName}を削除しました。"
  on:close={() => goto('/lecturers')}
/>

<style lang="scss">
  .image-wrapper {
    width: 90px;
    height: 120px;
    border: 1px solid $color-border;

    &:not(.blank) img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.blank {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $color-background;

      img {
        width: 27px;
        height: auto;
      }
    }
  }

  .contacts-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
