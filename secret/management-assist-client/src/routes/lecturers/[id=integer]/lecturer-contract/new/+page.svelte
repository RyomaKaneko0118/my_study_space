<script lang="ts">
  import { faUser } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import {
    lecturerContractsMutations,
    type CreateLecturerContractInput
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

  let showCreatedModalWithId: number | null = null

  const typeOptions = lecturerContractTypes.map((lecturerContractType) => {
    return {
      label: convertLecturerContractTypeLabel(lecturerContractType),
      value: lecturerContractType
    }
  })

  const contractorTypeOptions = lecturerContractContractorTypes.map(
    (contractorType) => {
      return {
        label: convertLecturerContractContractorTypeLabel(contractorType),
        value: contractorType
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
      type: typeOptions[0].value,
      contractorType: contractorTypeOptions[0].value,
      startDate: undefined as undefined | string,
      endDate: undefined as undefined | string,
      note: ''
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
      const input: CreateLecturerContractInput = {
        lecturerId: $lecturer.id,
        ...values,
        startDate: new Date(values.startDate as string),
        endDate: values.endDate ? new Date(values.endDate) : undefined
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: lecturerContractsMutations.createLecturerContract,
          variables: {
            createLecturerContractInput: input
          }
        })
        lecturer.update((lecturer) => {
          lecturer.lecturerContract = new LecturerContract(
            result.data.createLecturerContract
          )
          return lecturer
        })
        showCreatedModalWithId = result.data.createLecturerContract.id
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
  message="契約を登録しました。"
  on:close={() => {
    goto(`/lecturers/${$lecturer.id}/lecturer-contract`)
  }}
/>
