<script lang="ts">
  import { faUser } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { invalidate } from '$app/navigation'
  import { goto } from '$app/navigation'

  import {
    lecturerContractsMutations,
    type UpdateLecturerContractInput
  } from '$api/graphql/lecturer-contracts'

  import { loading, serverError } from '$stores/app'
  import { lecturer } from '$stores/lecturers'

  import apolloClient from '$lib/apollo'

  import CommonModal from '$lib/components/CommonModal.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: hasChanged = false

  let showUpdatedModal = false

  const { lecturerContract } = data

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
      // TODO 形式の変更
      startDate: lecturerContract.startDate,
      endDate: lecturerContract.endDate ? lecturerContract.endDate : null,
      note: lecturerContract.note
    },
    validationSchema: yup.object().shape({}),
    onSubmit: async (values) => {
      const input: UpdateLecturerContractInput = {
        id: lecturerContract.id,
        ...values,
        startDate: new Date(values.startDate),
        endDate: values.endDate ? new Date(values.endDate) : null
      }

      loading.set(true)

      try {
        await apolloClient.mutate({
          mutation: lecturerContractsMutations.updateLecturerContract,
          variables: {
            updateLecturerContractInput: input
          }
        })
        invalidate('lecturer:lecturer-contract')
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
    <form class="form" on:submit={handleSubmit} />
  </div>
</section>

<CommonModal
  show={showUpdatedModal}
  title="完了"
  message="{$lecturer.fullName}の契約を更新しました。"
  on:close={() => goto(`/lecturers/${$lecturer.id}/lecturer-contract`)}
/>
