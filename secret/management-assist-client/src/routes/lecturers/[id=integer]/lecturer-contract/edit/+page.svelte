<script lang="ts">
  import { faUser } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import {
    lecturerContractsMutations,
    type UpdateLecturerContractInput
  } from '$api/graphql/lecturer-contracts'

  import { loading, serverError } from '$stores/app'
  import { lecturer } from '$stores/lecturers'

  import apolloClient from '$lib/apollo'
  import {
    LecturerContract,
    lecturerContractTypes,
    lecturerContractContractorTypes,
    convertLecturerContractTypeLabel,
    convertLecturerContractContractorTypeLabel
  } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonRadioButton from '$lib/components/CommonRadioButton.svelte'
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: hasChanged =
    $form.type !== lecturerContract.type ||
    $form.contractorType !== lecturerContract.contractorType ||
    !dayjs($form.startDate).isSame(dayjs(lecturerContract.startDate), 'day') ||
    (!!$form.endDate && !lecturerContract.endDate) ||
    (!!lecturerContract.endDate &&
      !dayjs($form.endDate).isSame(dayjs(lecturerContract.endDate), 'day')) ||
    $form.note !== lecturerContract.note

  let showUpdatedModal = false

  const { lecturerContract } = data

  const typeOptions = lecturerContractTypes.map((lecturerContractType) => {
    return {
      label: convertLecturerContractTypeLabel(lecturerContractType),
      value: lecturerContractType
    }
  })

  const contractorTypeOptions = lecturerContractContractorTypes.map(
    (lecturerContractContractorType) => {
      return {
        label: convertLecturerContractContractorTypeLabel(
          lecturerContractContractorType
        ),
        value: lecturerContractContractorType
      }
    }
  )

  const resetError = () => {
    errors.set({
      type: '',
      contractorType: '',
      startDate: '',
      endDate: '',
      note: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      type: lecturerContract.type,
      contractorType: lecturerContract.contractorType,
      startDate: dayjs(lecturerContract.startDate).format('YYYY-MM-DD'),
      endDate: lecturerContract.endDate
        ? dayjs(lecturerContract.endDate).format('YYYY-MM-DD')
        : null,
      note: lecturerContract.note
    },
    validationSchema: yup.object().shape({
      type: yup.string().required(),
      contractorType: yup.string().required(),
      startDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .required(),
      endDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        })
        .min(yup.ref('startDate'), '契約開始日以降の日付を設定してください'),
      note: yup.string()
    }),
    onSubmit: async (values) => {
      const input: UpdateLecturerContractInput = {
        id: lecturerContract.id,
        ...values,
        startDate: new Date(values.startDate),
        endDate: values.endDate ? new Date(values.endDate) : null
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: lecturerContractsMutations.updateLecturerContract,
          variables: {
            updateLecturerContractInput: input
          }
        })
        lecturer.update((lecturer) => {
          lecturer.lecturerContract = new LecturerContract(
            result.data.updateLecturerContract
          )
          return lecturer
        })
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
    <h1 class="text-primary">
      <Fa icon={faUser} />
      <span class="ml-sm">{$lecturer.fullName}</span>
    </h1>
  </div>
  <div class="card my-md py-lg px-md">
    <form class="form" on:submit={handleSubmit}>
      <div class="input-group">
        <label for="contractorType">名義</label>
        {#each contractorTypeOptions as contractorTypeOption}
          <CommonRadioButton
            bind:modelValue={$form.contractorType}
            class="mr-md"
            value={contractorTypeOption.value}
            label={contractorTypeOption.label}
            disabled={contractorTypeOption.value === 'ORGANIZATION' &&
              !$lecturer.masterLecturerAffiliatedOrganization}
            on:input={resetError}
          />
        {/each}
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
        <label for="endDate">契約終了日</label>
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
      {/if}
      <div class="input-group mt-md">
        <label for="type">契約形態</label>
        {#each typeOptions as typeOption}
          <CommonRadioButton
            bind:modelValue={$form.type}
            class="mr-md"
            value={typeOption.value}
            label={typeOption.label}
            on:input={resetError}
          />
        {/each}
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
  message="契約を更新しました。"
  on:close={() => {
    goto(`/lecturers/${$lecturer.id}/lecturer-contract`)
  }}
/>
