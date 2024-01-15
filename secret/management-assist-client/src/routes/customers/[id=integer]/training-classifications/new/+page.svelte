<script lang="ts">
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import {
    trainingClassificationsMutations,
    type CreateTrainingClassificationInput
  } from '$api/graphql/training-classifications'

  import { admins, loading, serverError } from '$stores/app'
  import { customer, refetchManagers } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import {
    trainingClassificationTypes,
    convertTrainingClassificationTypeLabel
  } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  let showCreatedModalWithId: number | null = null

  const coordinatorCandidates =
    $customer.currentCustomerDetail?.coordinators.map((coordinator) => {
      return {
        coordinator,
        main: false,
        sub: false
      }
    }) || []

  const managerCandidates = $customer.managers.map((manager) => {
    return {
      manager,
      main: false,
      sub: false
    }
  })

  const managerCandidatesByDepartment = [
    {
      department: null,
      managerCandidates: managerCandidates.filter((managerCandidate) => {
        return !managerCandidate.manager.departmentId
      })
    },
    ...$customer.departments.map((department) => {
      return {
        department,
        managerCandidates: managerCandidates.filter((managerCandidate) => {
          return managerCandidate.manager.departmentId === department.id
        })
      }
    })
  ].filter(
    (managerCandidateByDepartment) =>
      managerCandidateByDepartment.managerCandidates.length !== 0
  )

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

  const typeOptions = trainingClassificationTypes.map(
    (trainingClassificationType) => {
      return {
        label: convertTrainingClassificationTypeLabel(
          trainingClassificationType
        ),
        value: trainingClassificationType
      }
    }
  )

  const resetError = () => {
    errors.set({
      departmentId: '',
      type: '',
      trainingDays: '',
      sales: '',
      note: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      departmentId: undefined as undefined | number,
      type: typeOptions[0].value,
      trainingDays: 0,
      sales: 0,
      note: ''
    },
    validationSchema: yup.object().shape({
      departmentId: yup.number(),
      type: yup.string().required(),
      trainingDays: yup
        .number()
        .transform((value) => {
          return isNaN(value) ? undefined : Number(value)
        })
        .required()
        .min(0),
      sales: yup
        .number()
        .transform((value) => {
          return isNaN(value) ? undefined : Number(value)
        })
        .required()
        .min(0),
      note: yup.string()
    }),
    onSubmit: async (values) => {
      const input: CreateTrainingClassificationInput = {
        customerDetailId: $customer.currentCustomerDetail?.id as number,
        ...values,
        trainingDays: Number(values.trainingDays),
        sales: Number(values.sales),
        createTrainingClassificationCoordinatorInputs: coordinatorCandidates
          .filter(
            (coordinatorCandidate) =>
              coordinatorCandidate.main || coordinatorCandidate.sub
          )
          .map((coordinatorCandidate) => {
            return {
              coordinatorId: coordinatorCandidate.coordinator.id,
              role: coordinatorCandidate.main ? 'MAIN' : 'SUB'
            }
          }),
        createTrainingClassificationManagerInputs: managerCandidates
          .filter(
            (managerCandidate) => managerCandidate.main || managerCandidate.sub
          )
          .map((managerCandidate) => {
            return {
              managerId: managerCandidate.manager.id,
              role: managerCandidate.main ? 'MAIN' : 'SUB'
            }
          })
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation:
            trainingClassificationsMutations.createTrainingClassification,
          variables: {
            createTrainingClassificationInput: input
          }
        })
        refetchManagers.set(true)
        showCreatedModalWithId = result.data.createTrainingClassification.id
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
        <label for="cosutomerDetail">
          <p>年度</p>
          <p class="fs-xs fw-bold text-error">【編集不可】</p>
        </label>
        <CommonInput
          id="cosutomerDetail"
          value={$customer.currentCustomerDetail?.financialYear}
          disabled
        />
      </div>
      <div class="input-group mt-md">
        <label for="type">
          <p>研修分類</p>
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
        <label for="trainingDays">
          <p>研修日数(日)</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="trainingDays"
          type="number"
          invalid={!!$errors.trainingDays}
          bind:value={$form.trainingDays}
          on:input={resetError}
        />
      </div>
      {#if $errors.trainingDays}
        <small class="error">{$errors.trainingDays}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="sales">
          <p>売上(円)</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="sales"
          type="number"
          invalid={!!$errors.sales}
          bind:value={$form.sales}
          on:input={resetError}
        />
      </div>
      {#if $errors.sales}
        <small class="error">{$errors.sales}</small>
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
            {@const admin = $admins.find(
              (admin) =>
                admin.saUserId === coordinatorCandidate.coordinator.saUserId
            )}
            <CommonCheckbox
              checked={coordinatorCandidate.main}
              disabled={coordinatorCandidate.sub}
              bind:value={coordinatorCandidate.main}
            >
              <span class="ml-sm text-gray">{admin?.displayName}</span>
            </CommonCheckbox>
          {/each}
        </div>
      </div>
      <div class="input-group mt-lg">
        <label for="subCoordinators">サブコーディネーター</label>
        <div class="coordinators">
          {#each coordinatorCandidates as coordinatorCandidate}
            {@const admin = $admins.find(
              (admin) =>
                admin.saUserId === coordinatorCandidate.coordinator.saUserId
            )}
            <CommonCheckbox
              checked={coordinatorCandidate.sub}
              disabled={coordinatorCandidate.main}
              bind:value={coordinatorCandidate.sub}
            >
              <span class="ml-sm text-gray">{admin?.displayName}</span>
            </CommonCheckbox>
          {/each}
        </div>
      </div>
      <div class="input-group mt-lg">
        <label for="mainManagers">メイン担当者</label>
        <div class="managers-wrapper">
          {#each managerCandidatesByDepartment as managerCandidateByDepartment}
            <p class="department">
              {managerCandidateByDepartment.department?.name || '本社'}
            </p>
            <div class="managers">
              {#each managerCandidateByDepartment.managerCandidates as managerCandidate}
                <CommonCheckbox
                  checked={managerCandidate.main}
                  disabled={managerCandidate.sub}
                  bind:value={managerCandidate.main}
                >
                  <span class="ml-sm text-gray"
                    >{managerCandidate.manager.fullName}</span
                  >
                </CommonCheckbox>
              {/each}
            </div>
          {/each}
        </div>
      </div>
      <div class="input-group mt-lg">
        <label for="subManagers">サブ担当者</label>
        <div class="managers-wrapper">
          {#each managerCandidatesByDepartment as managerCandidateByDepartment}
            <p class="department">
              {managerCandidateByDepartment.department?.name || '本社'}
            </p>
            <div class="managers">
              {#each managerCandidateByDepartment.managerCandidates as managerCandidate}
                <CommonCheckbox
                  checked={managerCandidate.sub}
                  disabled={managerCandidate.main}
                  bind:value={managerCandidate.sub}
                >
                  <span class="ml-sm text-gray"
                    >{managerCandidate.manager.fullName}</span
                  >
                </CommonCheckbox>
              {/each}
            </div>
          {/each}
        </div>
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
  message="研修分類を登録しました。"
  on:close={() =>
    goto(
      `/customers/${$customer.id}/training-classifications/${showCreatedModalWithId}`
    )}
/>

<style lang="scss">
  .managers-wrapper {
    .department {
      margin: 15px 0 5px 0;
      color: $color-gray;
      font-size: $font-size-sm;
      font-weight: $font-weight-bold;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .managers,
  .coordinators {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
  }
</style>
