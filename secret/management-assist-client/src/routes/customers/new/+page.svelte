<script lang="ts">
  import { faBuilding } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import {
    customersMutations,
    type CreateCustomerInput
  } from '$api/graphql/customers'

  import imgFileBlank from '$assets/images/file-blank.png'

  import { admins, loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { handleChangeFile } from '$lib/input-file'
  import { Customer } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  let logoInput: HTMLInputElement
  let logo: File | null = null
  let logoSrc: string
  let showCreatedModalWithId: number | null = null

  const coordinatorCandidates = $admins.map((admin) => {
    return {
      admin,
      main: false,
      sub: false
    }
  })

  const clientOptions = data.clients.map((client) => {
    if (client.customerId) {
      return {
        label: `${client.name}(同期済み)`,
        value: client.id,
        disabled: true
      }
    } else {
      return {
        label: client.name,
        value: client.id
      }
    }
  })

  const onChangeLogo = (payload: Event) => {
    handleChangeFile({
      payload,
      accept: 'IMAGE',
      callback: (file: File) => {
        logo = file
        logoSrc = URL.createObjectURL(file)
      }
    })
  }

  const resetError = () => {
    errors.set({
      boardClientId: '',
      dealingStartDate: '',
      link: '',
      parent: '',
      affiliate: '',
      note: '',
      contractNote: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      boardClientId: data.clients.find((client) => client.customerId === null)
        ?.id,
      dealingStartDate: undefined as undefined | string,
      link: '',
      parent: '',
      affiliate: '',
      note: '',
      contractNote: ''
    },
    validationSchema: yup.object().shape({
      boardClientId: yup
        .number()
        .required('同期するboard上の顧客を選択してください'),
      dealingStartDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .required(),
      link: yup.string().url()
    }),
    onSubmit: async (values) => {
      const input: CreateCustomerInput = {
        boardClientId: Number(values.boardClientId),
        dealingStartDate: new Date(values.dealingStartDate as string),
        logo,
        contractNote: values.contractNote,
        createCustomerDetailInput: {
          link: values.link,
          parent: values.parent,
          affiliate: values.affiliate,
          note: values.note,
          createCoordinatorInputs: coordinatorCandidates
            .filter(
              (coordinatorCandidate) =>
                coordinatorCandidate.main || coordinatorCandidate.sub
            )
            .map((coordinatorCandidate) => {
              return {
                saUserId: coordinatorCandidate.admin.saUserId,
                role: coordinatorCandidate.main ? 'MAIN' : 'SUB'
              }
            })
        }
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: customersMutations.createCustomer,
          variables: {
            createCustomerInput: input
          }
        })
        customer.set(new Customer(result.data.createCustomer))
        showCreatedModalWithId = result.data.createCustomer.id
      } catch {
        serverError.set(true)
      } finally {
        loading.set(false)
      }
    }
  })
</script>

<svelte:head>
  <title>顧客登録 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1 class="text-primary">
    <Fa icon={faBuilding} />
    <span class="ml-sm">顧客登録</span>
  </h1>
  <div class="card my-md py-lg px-md">
    <form class="form" on:submit={handleSubmit}>
      <div class="input-group">
        <label for="logo">ロゴ</label>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="logo-wrapper hoverable clickable"
          class:blank={!logoSrc}
          on:click={() => logoInput.click()}
        >
          <img src={logoSrc || imgFileBlank} alt="logo" />
          <input
            type="file"
            accept="image/*"
            class="d-none"
            bind:this={logoInput}
            on:change={onChangeLogo}
          />
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="boardClientId">
          <p>顧客(board)</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonSelect
          id="boardClientId"
          invalid={!!$errors.boardClientId}
          options={clientOptions}
          bind:value={$form.boardClientId}
          on:input={resetError}
        />
      </div>
      {#if $errors.boardClientId}
        <small class="error">{$errors.boardClientId}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="dealingStartDate">
          <p>取引開始日</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="dealingStartDate"
          type="date"
          invalid={!!$errors.dealingStartDate}
          bind:value={$form.dealingStartDate}
          on:input={resetError}
        />
      </div>
      {#if $errors.dealingStartDate}
        <small class="error">{$errors.dealingStartDate}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="contractNote">契約メモ</label>
        <CommonTextarea
          id="contractNote"
          resizable
          invalid={!!$errors.contractNote}
          bind:value={$form.contractNote}
          on:input={resetError}
        />
      </div>
      <div class="customer-detail-heading">年度別情報</div>
      <div class="input-group mt-md">
        <label for="link">リンク</label>
        <CommonInput
          id="link"
          invalid={!!$errors.link}
          bind:value={$form.link}
          on:input={resetError}
        />
      </div>
      {#if $errors.link}
        <small class="error">{$errors.link}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="parent">親会社</label>
        <CommonTextarea
          id="parent"
          resizable
          invalid={!!$errors.parent}
          bind:value={$form.parent}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="affiliate">関連会社</label>
        <CommonTextarea
          id="affiliate"
          resizable
          invalid={!!$errors.affiliate}
          bind:value={$form.affiliate}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="note">メモ</label>
        <CommonTextarea
          id="note"
          resizable
          invalid={!!$errors.note}
          bind:value={$form.note}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-lg">
        <label for="mainCoordinators">メインコーディネーター</label>
        <div class="coordinators">
          {#each coordinatorCandidates as coordinatorCandidate}
            <CommonCheckbox
              checked={coordinatorCandidate.main}
              disabled={coordinatorCandidate.sub}
              bind:value={coordinatorCandidate.main}
            >
              <span class="ml-sm text-gray"
                >{coordinatorCandidate.admin.displayName}</span
              >
            </CommonCheckbox>
          {/each}
        </div>
      </div>
      <div class="input-group mt-lg">
        <label for="subCoordinators">サブコーディネーター</label>
        <div class="coordinators">
          {#each coordinatorCandidates as coordinatorCandidate}
            <CommonCheckbox
              checked={coordinatorCandidate.sub}
              disabled={coordinatorCandidate.main}
              bind:value={coordinatorCandidate.sub}
            >
              <span class="ml-sm text-gray"
                >{coordinatorCandidate.admin.displayName}</span
              >
            </CommonCheckbox>
          {/each}
        </div>
      </div>
      <div class="default-btn-wrapper">
        <CommonButton type="submit" variant="primary" class="mt-lg"
          >登録</CommonButton
        >
      </div>
    </form>
  </div>
</section>

<CommonModal
  show={showCreatedModalWithId !== null}
  title="完了"
  message="顧客を登録しました。"
  on:close={() => goto(`/customers/${showCreatedModalWithId}`)}
/>

<style lang="scss">
  .logo-wrapper {
    height: 60px;

    &:not(.blank) img {
      height: 100%;
    }

    &.blank {
      width: 100%;
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

  .customer-detail-heading {
    width: 100%;
    margin: 30px 0 10px 0;
    padding-bottom: 10px;
    max-width: 660px;
    text-align: center;
    color: $color-gray;
    font-weight: $font-weight-bold;
    border-bottom: 1px solid $color-border;
  }

  .coordinators {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
  }
</style>
