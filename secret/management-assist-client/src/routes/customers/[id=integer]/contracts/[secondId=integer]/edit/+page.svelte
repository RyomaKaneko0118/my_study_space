<script lang="ts">
  import dayjs from 'dayjs'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'
  import { invalidate } from '$app/navigation'

  import {
    contractsMutations,
    type UpdateContractInput
  } from '$api/graphql/contracts'

  import { loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { handleChangeFile } from '$lib/input-file'
  import { contractTypes, convertContractTypeLabel } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonRadioButton from '$lib/components/CommonRadioButton.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: isPastEndDate =
    !!$form.endDate && dayjs($form.endDate).isBefore(new Date(), 'day')

  $: hasChanged =
    $form.name !== contract.name ||
    (!contract.departmentId && !!$form.departmentId) ||
    (!!contract.departmentId && $form.departmentId !== contract.departmentId) ||
    !dayjs($form.startDate).isSame(dayjs(contract.startDate), 'day') ||
    (!!$form.endDate && !contract.endDate) ||
    (!!contract.endDate &&
      !dayjs($form.endDate).isSame(dayjs(contract.endDate), 'day')) ||
    $form.type !== contract.type ||
    file !== null ||
    $form.autoUpdateCountOfMonths !== contract.autoUpdateCountOfMonths

  let fileInput: HTMLInputElement
  let file: File | null = null
  let showUpdatedModal = false

  const { contract } = data

  const departmentOptions = [
    {
      label: '本社'
    },
    ...$customer.departments.map((department) => {
      return {
        label: department.name,
        value: department.id
      }
    })
  ]

  const typeOptions = contractTypes.map((contractType) => {
    return {
      label: convertContractTypeLabel(contractType),
      value: contractType
    }
  })

  const onChangeFile = (payload: Event) => {
    handleChangeFile({
      payload,
      accept: 'PDF',
      callback: (changeFile: File) => {
        file = changeFile
      }
    })
  }

  const resetError = () => {
    errors.set({
      name: '',
      type: '',
      departmentId: '',
      startDate: '',
      endDate: '',
      autoUpdateCountOfMonths: '',
      _autoUpdate: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      name: contract.name,
      type: contract.type,
      departmentId: contract.departmentId || undefined,
      startDate: dayjs(contract.startDate).format('YYYY-MM-DD'),
      endDate: contract.endDate
        ? dayjs(contract.endDate).format('YYYY-MM-DD')
        : null,
      autoUpdateCountOfMonths: contract.autoUpdateCountOfMonths || undefined,
      _autoUpdate: !!contract.autoUpdateCountOfMonths
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      type: yup.string().required(),
      departmentId: yup.number(),
      startDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .required()
        .min(
          dayjs($customer.dealingStartDate).subtract(1, 'day'),
          `顧客との取引開始日(${dayjs($customer.dealingStartDate).format(
            'YYYY年MM月DD日'
          )})以降の日付を設定してください`
        ),
      endDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .min(yup.ref('startDate'), '契約開始日以降の日付を設定してください')
        .when('_autoUpdate', {
          is: (_autoUpdate: boolean) => _autoUpdate,
          then: (schema) => {
            return schema.required(
              '自動更新を有効にする場合は契約終了日を設定してください'
            )
          }
        }),
      autoUpdateCountOfMonths: yup
        .number()
        .transform((value) => {
          return Number.isNaN(value) ? undefined : value
        })
        .when('_autoUpdate', {
          is: (_autoUpdate: boolean) => _autoUpdate,
          then: (schema) => {
            return schema.required().min(1)
          }
        })
    }),
    onSubmit: async (values) => {
      const { _autoUpdate, ...attr } = values
      const input: UpdateContractInput = {
        id: contract.id,
        ...attr,
        departmentId: attr.departmentId ? attr.departmentId : null,
        startDate: new Date(attr.startDate),
        endDate: attr.endDate ? new Date(attr.endDate) : null,
        autoUpdateCountOfMonths: attr.autoUpdateCountOfMonths
          ? Number(attr.autoUpdateCountOfMonths)
          : null,
        file
      }

      loading.set(true)

      try {
        await apolloClient.mutate({
          mutation: contractsMutations.updateContract,
          variables: {
            updateContractInput: input
          }
        })
        invalidate('customer:contract')
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
        <label for="name">
          <p>契約名</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="name"
          invalid={!!$errors.name}
          bind:value={$form.name}
          on:input={resetError}
        />
      </div>
      {#if $errors.name}
        <small class="error">{$errors.name}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="departmentId">部門</label>
        <CommonSelect
          id="departmentId"
          invalid={!!$errors.departmentId}
          options={departmentOptions}
          bind:value={$form.departmentId}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="startDate">
          <p>契約開始日</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="startDate"
          type="date"
          invalid={!!$errors.startDate}
          bind:value={$form.startDate}
          on:input={resetError}
        />
      </div>
      {#if $errors.startDate}
        <small class="error">{$errors.startDate}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="endDate">
          <p>契約終了日</p>
          {#if $form._autoUpdate}
            <p class="fs-xs fw-bold text-error">【必須】</p>
          {/if}
        </label>
        <CommonInput
          id="endDate"
          type="date"
          invalid={!!$errors.endDate}
          bind:value={$form.endDate}
          on:input={resetError}
        />
      </div>
      {#if $errors.endDate}
        <small class="error">{$errors.endDate}</small>
      {:else if isPastEndDate}
        <small class="error text-warning"
          >契約ステータスは次回の契約情報更新バッチ処理で終了となります</small
        >
      {/if}
      <div class="input-group mt-md">
        <label for="type">
          <p>契約書媒体</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonSelect
          id="type"
          invalid={!!$errors.type}
          options={typeOptions}
          bind:value={$form.type}
          on:input={resetError}
        />
      </div>
      {#if $errors.type}
        <small class="error">{$errors.type}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="file">契約書</label>
        <CommonInput
          id="file"
          placeholder="PDFを選択"
          readonly
          value={file?.name || contract.fileName}
          class="text-gray"
          on:click={() => fileInput.click()}
        />
        <input
          type="file"
          accept="application/pdf"
          class="d-none"
          bind:this={fileInput}
          on:change={onChangeFile}
        />
      </div>
      <div class="input-group mt-md">
        <label for="seatMapSize">自動更新</label>
        <CommonRadioButton
          bind:modelValue={$form._autoUpdate}
          class="mr-md"
          value={true}
          label="有効"
          on:input={resetError}
        />
        <CommonRadioButton
          bind:modelValue={$form._autoUpdate}
          class="mr-md"
          value={false}
          label="無効"
          on:input={() => {
            $form.autoUpdateCountOfMonths = undefined
            resetError()
          }}
        />
      </div>
      {#if $form._autoUpdate}
        <div class="input-group mt-md">
          <label for="autoUpdateCountOfMonths">
            <p>更新時加算月数</p>
            <p class="fs-xs fw-bold text-error">【必須】</p>
          </label>
          <CommonInput
            id="autoUpdateCountOfMonths"
            type="number"
            invalid={!!$errors.autoUpdateCountOfMonths}
            bind:value={$form.autoUpdateCountOfMonths}
            on:input={resetError}
          />
        </div>
        {#if $errors.autoUpdateCountOfMonths}
          <small class="error">{$errors.autoUpdateCountOfMonths}</small>
        {/if}
      {/if}
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
  message="{contract.name}を更新しました。"
  on:close={() => goto(`/customers/${$customer.id}/contracts/${contract.id}`)}
/>
