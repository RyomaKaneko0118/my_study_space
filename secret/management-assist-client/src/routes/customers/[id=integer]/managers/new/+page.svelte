<script lang="ts">
  import { ApolloError } from '@apollo/client/core'
  import dayjs from 'dayjs'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import {
    managersMutations,
    type CreateManagerInput
  } from '$api/graphql/managers'

  import { loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { Manager } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  let showCreatedModalWithId: number | null = null

  const customerDealingStartYear = dayjs($customer.dealingStartDate).year()
  const startYearInitialValue = dayjs(new Date()).year()

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

  const resetError = () => {
    errors.set({
      departmentId: '',
      firstName: '',
      lastName: '',
      firstNameKana: '',
      lastNameKana: '',
      email: '',
      startYear: '',
      post: '',
      phoneNumber: '',
      note: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      departmentId: undefined as undefined | number,
      firstName: '',
      lastName: '',
      firstNameKana: '',
      lastNameKana: '',
      email: '',
      startYear:
        startYearInitialValue < customerDealingStartYear
          ? customerDealingStartYear
          : startYearInitialValue,
      post: '',
      phoneNumber: '',
      note: ''
    },
    validationSchema: yup.object().shape({
      departmentId: yup.number(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      firstNameKana: yup.string(),
      lastNameKana: yup.string(),
      email: yup.string().email(),
      startYear: yup
        .number()
        .transform((value) => {
          return value ? Number(value) : undefined
        })
        .required()
        .min(
          customerDealingStartYear,
          `顧客との取引開始年度(${customerDealingStartYear}年)以降の年度を設定してください`
        ),
      post: yup.string(),
      phoneNumber: yup.string(),
      note: yup.string()
    }),
    onSubmit: async (values) => {
      const input: CreateManagerInput = {
        customerId: $customer.id,
        ...values,
        email: values.email ? values.email : null,
        startYear: Number(values.startYear)
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: managersMutations.createManager,
          variables: {
            createManagerInput: input
          }
        })
        const createdManager = new Manager(result.data.createManager)
        $customer.managers = [...$customer.managers, createdManager]
        showCreatedModalWithId = createdManager.id
      } catch (e) {
        if (e instanceof ApolloError) {
          const { graphQLErrors } = e
          if (
            graphQLErrors[0].extensions.code === 'UNPROCESSABLE_ENTITY' &&
            graphQLErrors[0].message === 'DUPLICATE_EMAIL'
          ) {
            errors.set({
              ...$errors,
              email: 'すでに同一顧客内で登録されているemailです'
            })
            return
          }
        }
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
          <p>氏名</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="lastName"
          class="mr-xs"
          placeholder="氏"
          invalid={!!$errors.lastName}
          bind:value={$form.lastName}
          on:input={resetError}
        />
        <CommonInput
          id="firstName"
          class="ml-xs"
          placeholder="名"
          invalid={!!$errors.firstName}
          bind:value={$form.firstName}
          on:input={resetError}
        />
      </div>
      {#if $errors.lastName || $errors.firstName}
        <small class="error">{$errors.lastName || $errors.firstName}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="nameKana">氏名(かな)</label>
        <CommonInput
          id="lastNameKana"
          class="mr-xs"
          placeholder="氏(かな)"
          invalid={!!$errors.lastNameKana}
          bind:value={$form.lastNameKana}
          on:input={resetError}
        />
        <CommonInput
          id="firstNameKana"
          class="ml-xs"
          placeholder="名(かな)"
          invalid={!!$errors.firstNameKana}
          bind:value={$form.firstNameKana}
          on:input={resetError}
        />
      </div>
      {#if $errors.lastNameKana || $errors.firstNameKana}
        <small class="error"
          >{$errors.lastNameKana || $errors.firstNameKana}</small
        >
      {/if}
      <div class="input-group mt-md">
        <label for="email">メールアドレス</label>
        <CommonInput
          id="email"
          invalid={!!$errors.email}
          bind:value={$form.email}
          on:input={resetError}
        />
      </div>
      {#if $errors.email}
        <small class="error">{$errors.email}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="startYear">
          <p>担当開始年度</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="startYear"
          invalid={!!$errors.startYear}
          type="number"
          bind:value={$form.startYear}
          on:input={resetError}
        />
      </div>
      {#if $errors.startYear}
        <small class="error">{$errors.startYear}</small>
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
        <label for="post">職責</label>
        <CommonInput
          id="firstName"
          invalid={!!$errors.post}
          bind:value={$form.post}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="phoneNumber">電話番号</label>
        <CommonInput
          id="phoneNumber"
          invalid={!!$errors.phoneNumber}
          bind:value={$form.phoneNumber}
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
  message="担当者を登録しました。"
  on:close={() =>
    goto(`/customers/${$customer.id}/managers/${showCreatedModalWithId}`)}
/>
