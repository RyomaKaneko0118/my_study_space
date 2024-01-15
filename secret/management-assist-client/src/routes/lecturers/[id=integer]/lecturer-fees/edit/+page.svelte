<script lang="ts">
  import { faUser, faTrash } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import { lecturerFeesMutations } from '$api/graphql/lecturer-fees'
  import type {
    CreateLecturerFeeInput,
    UpdateLecturerFeesInput
  } from '$api/graphql/lecturer-fees'

  import { loading, serverError } from '$stores/app'
  import { lecturer } from '$stores/lecturers'

  import apolloClient from '$lib/apollo'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  import type { PageData } from './$types'

  export let data: PageData

  $: if ($errors) scrollToInvalidInput()

  $: hasChanged =
    $form.createLecturerFeeInputs.length !== 0 ||
    $form.updateLecturerFeeInputs.some((updateLecturerFeeInput) => {
      const lecturerFee = data.lecturerFees.find(
        (lecturerFee) => lecturerFee.id === updateLecturerFeeInput.id
      )
      return (
        lecturerFee &&
        (lecturerFee.label !== updateLecturerFeeInput.label ||
          lecturerFee.fee !== Number(updateLecturerFeeInput.fee) ||
          lecturerFee.note !== updateLecturerFeeInput.note)
      )
    }) ||
    deleteLecturerFeeIds.length !== 0

  let deleteLecturerFeeIds: number[] = []
  let showUpdatedModal = false

  const { lecturerDetail, lecturerFees } = data

  const scrollToInvalidInput = async () => {
    await tick()
    document.getElementsByClassName('invalid')[0]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const addLecturerFee = () => {
    $form.createLecturerFeeInputs = [
      ...$form.createLecturerFeeInputs,
      {
        label: '',
        fee: 0,
        note: ''
      }
    ]
  }

  const deleteNewLecturerFee = (index: number) => {
    resetError()
    $form.createLecturerFeeInputs = $form.createLecturerFeeInputs.filter(
      (_, i) => i !== index
    )
  }

  const deleteCurrentLecturerFee = (id: number) => {
    resetError()
    $form.updateLecturerFeeInputs = $form.updateLecturerFeeInputs.filter(
      (updateLecturerFeeInput) => updateLecturerFeeInput.id !== id
    )
    deleteLecturerFeeIds = [...deleteLecturerFeeIds, id]
  }

  const errorFormatter = (error: unknown) => {
    return error as {
      label: string
      fee: string
      note: string
    }
  }

  const resetError = () => {
    errors.set({
      createLecturerFeeInputs: '',
      updateLecturerFeeInputs: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      createLecturerFeeInputs: [] as CreateLecturerFeeInput[],
      updateLecturerFeeInputs: lecturerFees.map((lecturerFee) => ({
        id: lecturerFee.id,
        label: lecturerFee.label,
        fee: lecturerFee.fee,
        note: lecturerFee.note
      }))
    },
    validationSchema: yup.object().shape({
      createLecturerFeeInputs: yup.array().of(
        yup.object().shape({
          label: yup.string().required(),
          fee: yup
            .number()
            .required()
            .transform((value) => {
              return Number.isNaN(value) ? undefined : value
            })
            .min(100),
          note: yup.string()
        })
      ),
      updateLecturerFeeInputs: yup.array().of(
        yup.object().shape({
          label: yup.string().required(),
          fee: yup
            .number()
            .required()
            .transform((value) => {
              return Number.isNaN(value) ? undefined : value
            })
            .min(100),
          note: yup.string()
        })
      )
    }),
    onSubmit: async (values) => {
      const input: UpdateLecturerFeesInput = {
        lecturerDetailId: lecturerDetail.id,
        createLecturerFeeInputs: values.createLecturerFeeInputs.map(
          (createLecturerFeeInput) => {
            return {
              ...createLecturerFeeInput,
              fee: Number(createLecturerFeeInput.fee)
            }
          }
        ),
        updateLecturerFeeInputs: values.updateLecturerFeeInputs.map(
          (updateLecturerFeeInput) => {
            return {
              ...updateLecturerFeeInput,
              fee: Number(updateLecturerFeeInput.fee)
            }
          }
        ),
        deleteLecturerFeeIds
      }

      const labelsByInputs = [
        ...values.createLecturerFeeInputs.map((createLecturerFeeInput, i) => {
          return {
            type: 'create',
            index: i,
            label: createLecturerFeeInput.label
          }
        }),
        ...values.updateLecturerFeeInputs.map((updateLecturerFeeInput, i) => {
          return {
            type: 'update',
            index: i,
            label: updateLecturerFeeInput.label
          }
        })
      ]

      let duplicatedLabels: {
        type: string
        index: number
        label: string
      }[] = []
      for (const labelByInput of labelsByInputs) {
        duplicatedLabels = [
          ...duplicatedLabels,
          ...labelsByInputs.filter(
            (otherLabelByInput) =>
              labelByInput.label === otherLabelByInput.label &&
              (labelByInput.type !== otherLabelByInput.type ||
                labelByInput.index !== otherLabelByInput.index)
          )
        ]
      }

      if (duplicatedLabels.length !== 0) {
        const distinctDuplicatedLabels = duplicatedLabels.filter(
          (duplicatedLabel, i) =>
            duplicatedLabels.findIndex(
              (otherDuplicatedLabel) =>
                duplicatedLabel.type === otherDuplicatedLabel.type &&
                duplicatedLabel.index === otherDuplicatedLabel.index
            ) === i
        )
        errors.set({
          ...$errors,
          createLecturerFeeInputs: values.createLecturerFeeInputs.map(
            (_, i) => {
              return {
                label: distinctDuplicatedLabels.some(
                  (duplicatedLabel) =>
                    duplicatedLabel.type === 'create' &&
                    duplicatedLabel.index === i
                )
                  ? '区分が重複しています'
                  : ''
              }
            }
          ) as unknown as string,
          updateLecturerFeeInputs: values.updateLecturerFeeInputs.map(
            (_, i) => {
              return {
                label: distinctDuplicatedLabels.some(
                  (duplicatedLabel) =>
                    duplicatedLabel.type === 'update' &&
                    duplicatedLabel.index === i
                )
                  ? '区分が重複しています'
                  : ''
              }
            }
          ) as unknown as string
        })
        return
      }

      loading.set(true)

      try {
        await apolloClient.mutate({
          mutation: lecturerFeesMutations.updateLecturerFees,
          variables: {
            updateLecturerFeesInput: input
          }
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
  <form class="form mt-md" on:submit={handleSubmit}>
    {#each $form.updateLecturerFeeInputs as updateLecturerFeeInput, i}
      {@const error = errorFormatter($errors.updateLecturerFeeInputs[i])}
      <div
        class="card mb-sm py-lg px-md d-flex flex-direction-column align-items-center"
      >
        <div class="input-group">
          <div class="w-100 d-flex flex-direction-column">
            <div class="input-group">
              <label for="label">区分</label>
              <CommonInput
                invalid={!!error?.label}
                bind:value={updateLecturerFeeInput.label}
                on:input={resetError}
              />
            </div>
            {#if error?.label}
              <small class="error">{error.label}</small>
            {/if}
            <div class="input-group mt-md">
              <label for="fee">講師料(円)</label>
              <CommonInput
                type="number"
                invalid={!!error?.fee}
                bind:value={updateLecturerFeeInput.fee}
                on:input={resetError}
              />
            </div>
            {#if error?.fee}
              <small class="error">{error.fee}</small>
            {/if}
            <div class="input-group mt-md">
              <label for="note">メモ</label>
              <CommonTextarea
                id="note"
                resizable
                invalid={!!error?.note}
                bind:value={updateLecturerFeeInput.note}
                on:input={resetError}
              />
            </div>
          </div>
          <div class="ml-md text-error">
            <button
              type="button"
              on:click={() =>
                deleteCurrentLecturerFee(updateLecturerFeeInput.id)}
            >
              <Fa icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    {/each}
    {#each $form.createLecturerFeeInputs as createLecturerFeeInput, i}
      {@const error = errorFormatter($errors.createLecturerFeeInputs[i])}
      <div
        class="card mb-sm py-lg px-md d-flex flex-direction-column align-items-center"
      >
        <div class="input-group">
          <div class="w-100 d-flex flex-direction-column">
            <div class="input-group">
              <label for="label">区分</label>
              <CommonInput
                invalid={!!error?.label}
                bind:value={createLecturerFeeInput.label}
                on:input={resetError}
              />
            </div>
            {#if error?.label}
              <small class="error">{error.label}</small>
            {/if}
            <div class="input-group mt-md">
              <label for="fee">講師料(円)</label>
              <CommonInput
                type="number"
                invalid={!!error?.fee}
                bind:value={createLecturerFeeInput.fee}
                on:input={resetError}
              />
            </div>
            {#if error?.fee}
              <small class="error">{error.fee}</small>
            {/if}
            <div class="input-group mt-md">
              <label for="note">メモ</label>
              <CommonTextarea
                id="note"
                resizable
                invalid={!!error?.note}
                bind:value={createLecturerFeeInput.note}
                on:input={resetError}
              />
            </div>
          </div>
          <div class="ml-md text-error">
            <button type="button" on:click={() => deleteNewLecturerFee(i)}>
              <Fa icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    {/each}
    <div class="add-btn-wrapper">
      <CommonButton
        variant="secondary"
        size="sm"
        outline
        on:click={addLecturerFee}>追加</CommonButton
      >
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
</section>

<CommonModal
  show={showUpdatedModal}
  title="完了"
  message="講師料を更新しました。"
  on:close={() => goto(`/lecturers/${$lecturer.id}/lecturer-fees`)}
/>

<style lang="scss">
  .add-btn-wrapper {
    margin: 20px 0 0 auto;
    width: 120px;
  }
</style>
