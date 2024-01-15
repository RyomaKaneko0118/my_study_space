<script lang="ts">
  import {
    faSortDown,
    faPlus,
    faSort,
    faSortUp
  } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { customer } from '$stores/customers'

  import {
    trainingClassificationTypes,
    type TrainingClassification
  } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'

  type SortField = 'ID' | 'DEPARTMENT' | 'MAIN_TC' | 'SUB_TC'

  $: sortedMangaers = [...$customer.managers].sort((a, b) => {
    switch (sortArgs.field) {
      case 'ID': {
        if (sortArgs.direction === 'ASC') {
          return a.id - b.id
        } else {
          return b.id - a.id
        }
      }
      case 'DEPARTMENT': {
        if (sortArgs.direction === 'ASC') {
          return (a.departmentId || 0) - (b.departmentId || 0)
        } else {
          return (b.departmentId || 0) - (a.departmentId || 0)
        }
      }
      case 'MAIN_TC': {
        const targetTrainingClassificationIds = distinctTrainingClassifications
          .sort((a, b) => {
            if (sortArgs.direction === 'ASC') {
              return (
                trainingClassificationTypes.indexOf(a.type) -
                trainingClassificationTypes.indexOf(b.type)
              )
            } else {
              return (
                trainingClassificationTypes.indexOf(b.type) -
                trainingClassificationTypes.indexOf(a.type)
              )
            }
          })
          .map(
            (targetTrainingClassification) => targetTrainingClassification.id
          )

        let aFindIndex: number | null = null
        let bFindIndex: number | null = null
        for (const [index, targetTrainingClassificationId] of Object.entries(
          targetTrainingClassificationIds
        )) {
          if (
            aFindIndex === null &&
            a.mainTrainingClassifications.find(
              (mainTrainingClassification) =>
                mainTrainingClassification.id === targetTrainingClassificationId
            )
          ) {
            aFindIndex = Number(index)
          }

          if (
            bFindIndex === null &&
            b.mainTrainingClassifications.find(
              (mainTrainingClassification) =>
                mainTrainingClassification.id === targetTrainingClassificationId
            )
          ) {
            bFindIndex = Number(index)
          }

          if (aFindIndex !== null && bFindIndex !== null) {
            break
          }
        }
        if (aFindIndex === null) {
          return 1
        } else {
          return aFindIndex - (bFindIndex === null ? 1000 : bFindIndex)
        }
      }
      case 'SUB_TC': {
        const targetTrainingClassificationIds = distinctTrainingClassifications
          .sort((a, b) => {
            if (sortArgs.direction === 'ASC') {
              return (
                trainingClassificationTypes.indexOf(a.type) -
                trainingClassificationTypes.indexOf(b.type)
              )
            } else {
              return (
                trainingClassificationTypes.indexOf(b.type) -
                trainingClassificationTypes.indexOf(a.type)
              )
            }
          })
          .map(
            (targetTrainingClassification) => targetTrainingClassification.id
          )

        let aFindIndex: number | null = null
        let bFindIndex: number | null = null
        for (const [index, targetTrainingClassificationId] of Object.entries(
          targetTrainingClassificationIds
        )) {
          if (
            aFindIndex === null &&
            a.subTrainingClassifications.find(
              (subTrainingClassification) =>
                subTrainingClassification.id === targetTrainingClassificationId
            )
          ) {
            aFindIndex = Number(index)
          }

          if (
            bFindIndex === null &&
            b.subTrainingClassifications.find(
              (subTrainingClassification) =>
                subTrainingClassification.id === targetTrainingClassificationId
            )
          ) {
            bFindIndex = Number(index)
          }

          if (aFindIndex !== null && bFindIndex !== null) {
            break
          }
        }
        if (aFindIndex === null) {
          return 1
        } else {
          return aFindIndex - (bFindIndex === null ? 1000 : bFindIndex)
        }
      }
      default: {
        return 0
      }
    }
  })

  $: distinctTrainingClassifications = $customer.managers
    .flatMap((manager) =>
      manager.trainingClassificationManagers.flatMap(
        (trainingClassificationManager) =>
          trainingClassificationManager.trainingClassification as TrainingClassification
      )
    )
    .filter(
      (predicate, index, self) =>
        self.findIndex((target) => target?.id === predicate?.id) === index
    )

  const onClickSort = (field: SortField) => {
    sortArgs = {
      field,
      direction:
        sortArgs.field !== field || sortArgs.direction !== 'ASC'
          ? 'ASC'
          : 'DESC'
    }
  }

  let sortArgs: {
    field: SortField
    direction: 'ASC' | 'DESC'
  } = {
    field: 'ID',
    direction: 'ASC'
  }
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
          on:click={() => goto(`/customers/${$customer.id}/managers/new`)}
        >
          <Fa icon={faPlus} />
          <span class="ml-xs">登録</span>
        </CommonButton>
      </div>
    {/if}
  </div>
  <div class="table-wrapper my-md">
    <table class="table">
      <thead>
        <tr>
          <th class="clickable" on:click={() => onClickSort('ID')}>
            <span>ID</span>
            <span
              class="sort-icon-wrapper"
              class:active={sortArgs.field === 'ID'}
            >
              {#if sortArgs.field === 'ID'}
                <Fa
                  icon={sortArgs.direction === 'ASC' ? faSortUp : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th>氏名</th>
          <th class="clickable" on:click={() => onClickSort('DEPARTMENT')}>
            <span>部門</span>
            <span
              class="sort-icon-wrapper"
              class:active={sortArgs.field === 'DEPARTMENT'}
            >
              {#if sortArgs.field === 'DEPARTMENT'}
                <Fa
                  icon={sortArgs.direction === 'ASC' ? faSortUp : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th>職責</th>
          <th class="clickable" on:click={() => onClickSort('MAIN_TC')}>
            <span>メイン担当研修</span>
            <span
              class="sort-icon-wrapper"
              class:active={sortArgs.field === 'MAIN_TC'}
            >
              {#if sortArgs.field === 'MAIN_TC'}
                <Fa
                  icon={sortArgs.direction === 'ASC' ? faSortUp : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th class="clickable" on:click={() => onClickSort('SUB_TC')}>
            <span>サブ担当研修</span>
            <span
              class="sort-icon-wrapper"
              class:active={sortArgs.field === 'SUB_TC'}
            >
              {#if sortArgs.field === 'SUB_TC'}
                <Fa
                  icon={sortArgs.direction === 'ASC' ? faSortUp : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each sortedMangaers as manager}
          {@const department = $customer.departments.find(
            (department) => department.id === manager.departmentId
          )}
          <tr
            class="clickable hoverable"
            on:click={() =>
              goto(`/customers/${$customer.id}/managers/${manager.id}`)}
          >
            <th>{manager.id}</th>
            <td>{manager.fullName}</td>
            <td>{department?.name || '本社'}</td>
            <td>{manager.post}</td>
            <td>
              <div class="default-badges-wrapper py-sm">
                {#each manager.mainTrainingClassifications as trainingClassification}
                  {#if trainingClassification.customerDetailId === $customer.currentCustomerDetail?.id}
                    <span class="badge secondary"
                      >{trainingClassification.typeLabel}</span
                    >
                  {/if}
                {/each}
              </div>
            </td>
            <td>
              <div class="default-badges-wrapper py-sm">
                {#each manager.subTrainingClassifications as trainingClassification}
                  {#if trainingClassification.customerDetailId === $customer.currentCustomerDetail?.id}
                    <span class="badge primary"
                      >{trainingClassification.typeLabel}</span
                    >
                  {/if}
                {/each}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
