<script lang="ts">
  import dayjs from 'dayjs'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import {
    customersMutations,
    type UpdateCustomerInput
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
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  $: hasChanged =
    logo !== null ||
    !dayjs($form.dealingStartDate).isSame(
      dayjs($customer.dealingStartDate),
      'day'
    ) ||
    (!!$form.dealingEndDate && !$customer.dealingEndDate) ||
    (!!$customer.dealingEndDate &&
      !dayjs($form.dealingEndDate).isSame(
        dayjs($customer.dealingEndDate),
        'day'
      )) ||
    $form.contractNote !== $customer.contractNote ||
    $form.link !== $customer.currentCustomerDetail?.link ||
    $form.parent !== $customer.currentCustomerDetail?.parent ||
    $form.affiliate !== $customer.currentCustomerDetail?.affiliate ||
    $form.note !== $customer.currentCustomerDetail?.note ||
    !!coordinatorCandidates.find((coordinatorCandidate) => {
      const targetCurrentCoordinator =
        $customer.currentCustomerDetail?.coordinators.find(
          (currentCoordinator) =>
            currentCoordinator.saUserId === coordinatorCandidate.admin.saUserId
        )
      if (targetCurrentCoordinator) {
        return (
          (targetCurrentCoordinator.role === 'MAIN' &&
            !coordinatorCandidate.main) ||
          (targetCurrentCoordinator.role === 'SUB' && !coordinatorCandidate.sub)
        )
      } else {
        return coordinatorCandidate.main || coordinatorCandidate.sub
      }
    })

  let logoInput: HTMLInputElement
  let logo: File | null = null
  let logoSrc = $customer.logoUrl
  let showUpdatedModal = false

  const coordinatorCandidates = $admins.map((admin) => {
    return {
      admin,
      main: !!$customer.currentCustomerDetail?.coordinators.find(
        (coordinator) =>
          coordinator.saUserId === admin.saUserId && coordinator.role === 'MAIN'
      ),
      sub: !!$customer.currentCustomerDetail?.coordinators.find(
        (coordinator) =>
          coordinator.saUserId === admin.saUserId && coordinator.role === 'SUB'
      )
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
      dealingStartDate: '',
      dealingEndDate: '',
      link: '',
      parent: '',
      affiliate: '',
      note: '',
      contractNote: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      dealingStartDate: dayjs($customer.dealingStartDate).format('YYYY-MM-DD'),
      dealingEndDate: $customer.dealingEndDate
        ? dayjs($customer.dealingEndDate).format('YYYY-MM-DD')
        : null,
      link: $customer.currentCustomerDetail?.link,
      parent: $customer.currentCustomerDetail?.parent,
      affiliate: $customer.currentCustomerDetail?.affiliate,
      note: $customer.currentCustomerDetail?.note,
      contractNote: $customer.contractNote
    },
    validationSchema: yup.object().shape({
      dealingStartDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .required(),
      dealingEndDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .min(
          yup.ref('dealingStartDate'),
          '取引開始日以降の日付を設定してください'
        ),
      link: yup.string().url()
    }),
    onSubmit: async (values) => {
      const input: UpdateCustomerInput = {
        id: $customer.id,
        dealingStartDate: new Date(values.dealingStartDate),
        dealingEndDate: values.dealingEndDate
          ? new Date(values.dealingEndDate)
          : null,
        logo,
        contractNote: values.contractNote,
        updateCustomerDetailInput: {
          link: values.link,
          parent: values.parent,
          affiliate: values.affiliate,
          note: values.note,
          createCoordinatorInputs: coordinatorCandidates
            .filter((coordinatorCandidate) => {
              const targetCurrentCoordinator =
                $customer.currentCustomerDetail?.coordinators.find(
                  (currentCoordinator) =>
                    currentCoordinator.saUserId ===
                    coordinatorCandidate.admin.saUserId
                )
              if (targetCurrentCoordinator) {
                return (
                  (targetCurrentCoordinator.role === 'MAIN' &&
                    coordinatorCandidate.sub) ||
                  (targetCurrentCoordinator.role === 'SUB' &&
                    coordinatorCandidate.main)
                )
              } else {
                return coordinatorCandidate.main || coordinatorCandidate.sub
              }
            })
            .map((coordinatorCandidate) => {
              return {
                saUserId: coordinatorCandidate.admin.saUserId,
                role: coordinatorCandidate.main ? 'MAIN' : 'SUB'
              }
            }),
          deleteCoordinatorIds: coordinatorCandidates
            .map((coordinatorCandidate) => {
              const targetCurrentCoordinator =
                $customer.currentCustomerDetail?.coordinators.find(
                  (currentCoordinator) =>
                    currentCoordinator.saUserId ===
                    coordinatorCandidate.admin.saUserId
                )
              if (
                targetCurrentCoordinator &&
                ((targetCurrentCoordinator.role === 'MAIN' &&
                  !coordinatorCandidate.main) ||
                  (targetCurrentCoordinator.role === 'SUB' &&
                    !coordinatorCandidate.sub))
              ) {
                return targetCurrentCoordinator.id
              } else {
                return null
              }
            })
            .filter((v) => v) as number[]
        }
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: customersMutations.updateCustomer,
          variables: {
            updateCustomerInput: input
          }
        })
        customer.set(new Customer(result.data.updateCustomer))
        showUpdatedModal = true
      } catch {
        serverError.set(true)
      } finally {
        loading.set(false)
      }
    }
  })
</script>

<section class="content">
  <div class="d-flex justify-content-space-between">
    {#if $customer.logoUrl}
      <img
        src={$customer.logoUrl}
        alt={$customer.currentCustomerDetail?.name}
        class="customer-logo mt-xs"
      />
    {:else}
      <h1 class="text-primary">{$customer.currentCustomerDetail?.name}</h1>
    {/if}
  </div>
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
        <label for="dealingEndDate">取引終了日</label>
        <CommonInput
          id="dealingEndDate"
          type="date"
          invalid={!!$errors.dealingEndDate}
          bind:value={$form.dealingEndDate}
          on:input={resetError}
        />
      </div>
      {#if $errors.dealingEndDate}
        <small class="error">{$errors.dealingEndDate}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="note">契約メモ</label>
        <CommonTextarea
          id="note"
          resizable
          invalid={!!$errors.contractNote}
          bind:value={$form.contractNote}
          on:input={resetError}
        />
      </div>
      <div class="customer-detail-heading">
        {$customer.currentCustomerDetail?.financialYear}年度情報
      </div>
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
        <CommonButton
          type="submit"
          variant="primary"
          class="mt-lg"
          disabled={!hasChanged}>更新</CommonButton
        >
      </div>
    </form>
  </div>
</section>

<CommonModal
  show={showUpdatedModal}
  title="完了"
  message="{$customer.currentCustomerDetail?.name}を更新しました。"
  on:close={() => goto(`/customers/${$customer.id}`)}
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
