<script lang="ts">
  import dayjs from 'dayjs'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'
  import { invalidate } from '$app/navigation'

  import {
    departmentsMutations,
    type UpdateDepartmentInput
  } from '$api/graphql/departments'
  import zipcloudAPI from '$api/zipcloud'

  import { loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import {
    Department,
    prefectureCodes,
    convertPrefectureLabel
  } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: hasChanged =
    $form.name !== department.name ||
    !dayjs($form.dealingStartDate).isSame(
      dayjs(department.dealingStartDate),
      'day'
    ) ||
    (!!$form.dealingEndDate && !department.dealingEndDate) ||
    (!!department.dealingEndDate &&
      !dayjs($form.dealingEndDate).isSame(
        dayjs(department.dealingEndDate),
        'day'
      )) ||
    $form.postalCode !== department.postalCode ||
    (!department.prefectureCode && !!$form.prefectureCode) ||
    (!!department.prefectureCode &&
      $form.prefectureCode !== department.prefectureCode) ||
    $form.city !== department.city ||
    $form.town !== department.town ||
    $form.addressLine !== department.addressLine ||
    $form.note !== department.note

  let showUpdatedModal = false
  let showZipcloudErrorModal = false

  const { department } = data

  const prefectureOptions = [
    { label: '未選択' },
    ...prefectureCodes.map((prefectureCode) => {
      return {
        label: convertPrefectureLabel(prefectureCode),
        value: prefectureCode
      }
    })
  ]

  const onInputPrefectureCode = () => {
    resetError()
    $form.postalCode = ''
    $form.city = ''
    $form.town = ''
    $form.addressLine = ''
  }

  const searchAddressByPostalCode = async () => {
    loading.set(true)

    try {
      const result = await zipcloudAPI.search($form.postalCode)

      if (result.data.status === 200 && result.data.results[0]) {
        const addressResult = result.data.results[0]
        $form.prefectureCode = Number(addressResult.prefcode)
        $form.city = addressResult.address2
        $form.town = addressResult.address3
        $form.addressLine = ''
      } else {
        showZipcloudErrorModal = true
      }
    } catch {
      showZipcloudErrorModal = true
    } finally {
      loading.set(false)
    }
  }

  const resetError = () => {
    errors.set({
      name: '',
      dealingStartDate: '',
      dealingEndDate: '',
      note: '',
      postalCode: '',
      prefectureCode: '',
      city: '',
      town: '',
      addressLine: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      name: department.name,
      dealingStartDate: dayjs(department.dealingStartDate).format('YYYY-MM-DD'),
      dealingEndDate: department.dealingEndDate
        ? dayjs(department.dealingEndDate).format('YYYY-MM-DD')
        : null,
      note: department.note,
      postalCode: department.postalCode,
      prefectureCode: department.prefectureCode || undefined,
      city: department.city,
      town: department.town,
      addressLine: department.addressLine
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      dealingStartDate: yup
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
      dealingEndDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .min(
          yup.ref('dealingStartDate'),
          '取引開始日以降の日付を設定してください'
        ),
      note: yup.string(),
      postalCode: yup.lazy((value) =>
        !value
          ? yup.string()
          : yup
              .string()
              .matches(
                /^[0-9]{3}-?[0-9]{4}$/,
                '半角数字7桁(ハイフン任意)で入力してください'
              )
      ),
      prefectureCode: yup.number().min(1).max(47),
      city: yup.string(),
      town: yup.string(),
      addressLine: yup.string()
    }),
    onSubmit: async (values) => {
      const input: UpdateDepartmentInput = {
        id: department.id,
        ...values,
        dealingStartDate: new Date(values.dealingStartDate),
        dealingEndDate: values.dealingEndDate
          ? new Date(values.dealingEndDate)
          : null,
        prefectureCode: values.prefectureCode || null
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: departmentsMutations.updateDepartment,
          variables: {
            updateDepartmentInput: input
          }
        })
        $customer.departments = $customer.departments.map(
          (storedDepartment) => {
            if (storedDepartment.id === department.id) {
              return new Department(result.data.updateDepartment)
            } else {
              return storedDepartment
            }
          }
        )
        invalidate('customer:department')
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
          <p>部門名</p>
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
        <label for="postalCode">郵便番号</label>
        <CommonInput
          id="postalCode"
          placeholder="ハイフン任意"
          invalid={!!$errors.postalCode}
          bind:value={$form.postalCode}
          on:input={resetError}
        />
        <div class="default-btn-fit-wrapper ml-sm">
          <CommonButton
            variant="secondary"
            size="sm"
            outline
            disabled={!$form.postalCode}
            on:click={searchAddressByPostalCode}>検索</CommonButton
          >
        </div>
      </div>
      {#if $errors.postalCode}
        <small class="error">{$errors.postalCode}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="address">住所</label>
        <CommonSelect
          id="prefectureCode"
          class="mr-xs"
          invalid={!!$errors.prefectureCode}
          options={prefectureOptions}
          bind:value={$form.prefectureCode}
          on:input={onInputPrefectureCode}
        />
        <CommonInput
          id="city"
          class="ml-xs"
          placeholder="市区町村"
          invalid={!!$errors.city}
          bind:value={$form.city}
          on:input={resetError}
        />
      </div>
      {#if $errors.city}
        <small class="error">{$errors.city}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="town" />
        <CommonInput
          id="town"
          placeholder="町域"
          invalid={!!$errors.town}
          bind:value={$form.town}
          on:input={resetError}
        />
      </div>
      {#if $errors.town}
        <small class="error">{$errors.town}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="addressLine" />
        <CommonInput
          id="addressLine"
          placeholder="番地 / 建物名"
          invalid={!!$errors.addressLine}
          bind:value={$form.addressLine}
          on:input={resetError}
        />
      </div>
      {#if $errors.addressLine}
        <small class="error">{$errors.addressLine}</small>
      {/if}
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
  show={showZipcloudErrorModal}
  title="エラー"
  message="郵便番号検索に失敗しました。"
  on:close={() => (showZipcloudErrorModal = false)}
/>

<CommonModal
  show={showUpdatedModal}
  title="完了"
  message="{department.name}を更新しました。"
  on:close={() =>
    goto(`/customers/${$customer.id}/departments/${department.id}`)}
/>
