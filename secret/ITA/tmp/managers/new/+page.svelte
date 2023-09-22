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

  const dealingStartYear = dayjs($customer.dealingStartDate).year()

  const getDepartments = $customer.departments.map((department) => {
    return {
      label: department.name,
      value: department.id
    }
  })
  const departmentOptions = [
    {
      label: '未選択',
      value: undefined
    },
    ...getDepartments
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
      role: '',
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
      startYear: dealingStartYear,
      post: '',
      role: '',
      phoneNumber: '',
      note: ''
    },
    validationSchema: yup.object().shape({
      departmentId: yup.number(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      firstNameKana: yup.string().required(),
      lastNameKana: yup.string().required(),
      email: yup.string().required().email(),
      startYear: yup
        .number()
        .required()
        .min(
          dealingStartYear,
          `顧客との取引開始年度(${dealingStartYear}年)以降の年度を設定してください`
        ),
      post: yup.string(),
      role: yup.string(),
      phoneNumber: yup.string(),
      note: yup.string()
    }),
    onSubmit: async (values) => {
      const input: CreateManagerInput = {
        customerId: $customer.id,
        ...values
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
          console.log(graphQLErrors[0].message)
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
        <label for="latName">氏</label>
        <CommonInput
          id="lastName"
          invalid={!!$errors.lastName}
          bind:value={$form.lastName}
          on:input={resetError}
        />
      </div>
      {#if $errors.lastName}
        <small class="error">{$errors.lastName}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="firstName">名</label>
        <CommonInput
          id="firstName"
          invalid={!!$errors.firstName}
          bind:value={$form.firstName}
          on:input={resetError}
        />
      </div>
      {#if $errors.firstName}
        <small class="error">{$errors.firstName}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="lastNameKana">氏(フリガナ)</label>
        <CommonInput
          id="firstName"
          invalid={!!$errors.lastNameKana}
          bind:value={$form.lastNameKana}
          on:input={resetError}
        />
      </div>
      {#if $errors.lastNameKana}
        <small class="error">{$errors.lastNameKana}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="firstNameKana">名(フリガナ)</label>
        <CommonInput
          id="firstName"
          invalid={!!$errors.firstNameKana}
          bind:value={$form.firstNameKana}
          on:input={resetError}
        />
      </div>
      {#if $errors.firstNameKana}
        <small class="error">{$errors.firstNameKana}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="email">メールアドレス</label>
        <CommonInput
          id="email"
          invalid={!!$errors.email}
          type="email"
          bind:value={$form.email}
          on:input={resetError}
        />
      </div>
      {#if $errors.email}
        <small class="error">{$errors.email}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="startYear">担当開始年度</label>
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
      {#if $errors.departmentId}
        <small class="error">{$errors.departmentId}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="post">職責</label>
        <CommonInput
          id="firstName"
          invalid={!!$errors.post}
          bind:value={$form.post}
          on:input={resetError}
        />
      </div>
      {#if $errors.post}
        <small class="error">{$errors.post}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="role">役割</label>
        <CommonInput
          id="role"
          invalid={!!$errors.role}
          bind:value={$form.role}
          on:input={resetError}
        />
      </div>
      {#if $errors.role}
        <small class="error">{$errors.role}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="phoneNumber">電話番号</label>
        <CommonInput
          id="phoneNumber"
          invalid={!!$errors.phoneNumber}
          bind:value={$form.phoneNumber}
          on:input={resetError}
        />
      </div>
      {#if $errors.phoneNumber}
        <small class="error">{$errors.phoneNumber}</small>
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
