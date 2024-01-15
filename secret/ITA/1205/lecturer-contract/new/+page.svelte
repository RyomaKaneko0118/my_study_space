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
    lecturerContractTypes,
    lecturerContractContractorTypes,
    convertLecturerContractTypeLabel,
    convertLecturerContractContractorTypeLabel
  } from '$lib/models'

  import CommonModal from '$lib/components/CommonModal.svelte'

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
    validationSchema: yup.object().shape({}),
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
    <form class="form" on:submit={handleSubmit} />
  </div>
</section>

<CommonModal
  show={showCreatedModalWithId !== null}
  title="完了"
  message="契約を登録しました。"
  on:close={() => goto(`/lecturers/${$lecturer.id}/lecturer-contract`)}
/>
