<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { trainingClassificationsQueries } from '$api/graphql/training-classifications'

  import { admins, loading, serverError } from '$stores/app'
  import { customer } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { TrainingClassification } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonTab from '$lib/components/CommonTab.svelte'

  $: if (currentCustomerDetail) {
    if (
      trainingClassificationsByCustomerDetailId.has(currentCustomerDetail.id)
    ) {
      currentTrainingClassifications =
        trainingClassificationsByCustomerDetailId.get(
          currentCustomerDetail.id
        ) || []
    } else {
      fetchTrainingClassifications()
    }
  }

  $: currentCustomerDetail =
    $customer.customerDetails[currentCustomerDetailTabIndex]

  let currentCustomerDetailTabIndex = 0
  let currentTrainingClassifications: TrainingClassification[] = []

  const customerDetailTabItems = $customer.customerDetails.map(
    (customerDetail) => {
      return {
        label: String(customerDetail.financialYear)
      }
    }
  )

  const trainingClassificationsByCustomerDetailId: Map<
    number,
    TrainingClassification[]
  > = new Map()

  const fetchTrainingClassifications = async () => {
    loading.set(true)

    try {
      const result = await apolloClient.query({
        query: trainingClassificationsQueries.getTrainingClassifications,
        variables: {
          customerDetailId: currentCustomerDetail.id
        },
        fetchPolicy: 'no-cache'
      })

      const fetchedTrainingClassifications =
        result.data.trainingClassifications.map(
          (trainingClassification: TrainingClassification) =>
            new TrainingClassification(trainingClassification)
        )
      trainingClassificationsByCustomerDetailId.set(
        currentCustomerDetail.id,
        fetchedTrainingClassifications
      )
      currentTrainingClassifications = fetchedTrainingClassifications
    } catch {
      serverError.set(true)
      currentTrainingClassifications = []
    } finally {
      loading.set(false)
    }
  }

  onMount(fetchTrainingClassifications)
</script>

<section class="content">
  <div class="d-flex justify-content-space-between">
    {#if $customer.logoUrl}
      <img
        src={$customer.logoUrl}
        alt={$customer.currentCustomerDetail?.name}
        class="customer-logo mt-auto"
      />
    {:else}
      <h1 class="text-primary">{$customer.currentCustomerDetail?.name}</h1>
    {/if}
    {#if !$customer.archived}
      <div>
        <CommonButton
          variant="primary"
          size="sm"
          on:click={() =>
            goto(`/customers/${$customer.id}/training-classifications/new`)}
        >
          <Fa icon={faPlus} />
          <span class="ml-xs">登録</span>
        </CommonButton>
      </div>
    {/if}
  </div>
  <div class="mt-md">
    <CommonTab
      items={customerDetailTabItems}
      bind:currentTabIndex={currentCustomerDetailTabIndex}
    />
  </div>
  <div class="table-wrapper mt-xs mb-md">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>研修分類</th>
          <th>部門</th>
          <th>コーディネーター</th>
          <th>担当者</th>
          <th class="text-right">研修日数</th>
          <th class="text-right">売上</th>
        </tr>
      </thead>
      <tbody>
        {#each currentTrainingClassifications as trainingClassification}
          {@const department = $customer.departments.find(
            (department) =>
              department.id === trainingClassification.departmentId
          )}
          <tr
            class="clickable hoverable"
            on:click={() =>
              goto(
                `/customers/${$customer.id}/training-classifications/${trainingClassification.id}`
              )}
          >
            <th>{trainingClassification.id}</th>
            <td>{trainingClassification.typeLabel}</td>
            <td>{department?.name || '本社'}</td>
            <td>
              <div class="default-badges-wrapper py-sm">
                {#each trainingClassification.mainCoordinators as mainCoordinator}
                  {@const admin = $admins.find(
                    (admin) => admin.saUserId === mainCoordinator.saUserId
                  )}
                  {#if admin}
                    <span class="badge secondary">{admin?.displayName}</span>
                  {:else}
                    <span class="badge warning">不明</span>
                  {/if}
                {/each}
                {#each trainingClassification.subCoordinators as subCoordinator}
                  {@const admin = $admins.find(
                    (admin) => admin.saUserId === subCoordinator.saUserId
                  )}
                  {#if admin}
                    <span class="badge primary">{admin?.displayName}</span>
                  {:else}
                    <span class="badge warning">不明</span>
                  {/if}
                {/each}
              </div>
            </td>
            <td>
              <div class="default-badges-wrapper py-sm">
                {#each trainingClassification.mainManagers as mainManager}
                  <span class="badge secondary">{mainManager.fullName}</span>
                {/each}
                {#each trainingClassification.subManagers as subManager}
                  <span class="badge primary">{subManager.fullName}</span>
                {/each}
              </div>
            </td>
            <td class="text-right">{trainingClassification.trainingDays}日</td>
            <td class="text-right"
              >¥{trainingClassification.sales.toLocaleString()}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
