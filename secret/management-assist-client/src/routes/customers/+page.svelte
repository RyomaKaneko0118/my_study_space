<script lang="ts">
  import {
    faBuilding,
    faPlus,
    faSortDown,
    faSortUp,
    faSort,
    faThumbTack
  } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import { customerPinsMutations } from '$api/graphql/customer-pins'
  import { customersQueries } from '$api/graphql/customers'

  import SearchForm from '$routes/customers/SearchForm.svelte'

  import { admins, loading, serverError } from '$stores/app'
  import { authenticatedAdmin } from '$stores/auth'
  import { customers, pageInfo, filterAndSortArgs } from '$stores/customers'

  import apolloClient from '$lib/apollo'
  import { Customer, type Edge } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonPagination from '$lib/components/CommonPagination.svelte'

  let notHoverable = false

  const onClickPin = async (customer: Customer) => {
    loading.set(true)
    try {
      await apolloClient.mutate({
        mutation: customer.pinned
          ? customerPinsMutations.deleteCustomerPin
          : customerPinsMutations.createCustomerPin,
        variables: {
          customerId: customer.id
        }
      })
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }

    customers.set(
      $customers.map((storedCustomer) => {
        if (storedCustomer.id === customer.id) {
          if (storedCustomer.pinned) {
            storedCustomer.customerPins = []
          } else {
            storedCustomer.customerPins = [
              {
                saUserId: $authenticatedAdmin?.saUserId as number,
                customerId: storedCustomer.id
              }
            ]
          }
        }
        return storedCustomer
      })
    )
  }

  const onClickSort = (field: 'ID' | 'SALES') => {
    $filterAndSortArgs = {
      ...$filterAndSortArgs,
      field,
      direction:
        $filterAndSortArgs.field !== field ||
        $filterAndSortArgs.direction !== 'ASC'
          ? 'ASC'
          : 'DESC'
    }
    fetchCustomers(1, true)
  }

  const onClickPage = (page: number) => {
    fetchCustomers(page)
  }

  const fetchCustomers = async (page = 1, forceLoading = false) => {
    if (forceLoading || $pageInfo?.currentPage !== page) {
      loading.set(true)
    }

    try {
      const result = await apolloClient.query({
        query: customersQueries.getCustomers,
        variables: {
          page,
          ...$filterAndSortArgs
        },
        fetchPolicy: 'no-cache'
      })
      customers.set(
        result.data.customers.edges.map((edge: Edge) => new Customer(edge.node))
      )
      pageInfo.set(result.data.customers.pageInfo)
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  onMount(() => {
    fetchCustomers($pageInfo?.currentPage)
  })
</script>

<svelte:head>
  <title>顧客 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faBuilding} />
      <span class="ml-sm">顧客</span>
    </h1>
    <div>
      <CommonButton
        variant="primary"
        size="sm"
        on:click={() => goto('/customers/new')}
      >
        <Fa icon={faPlus} />
        <span class="ml-xs">登録</span>
      </CommonButton>
    </div>
  </div>
  <div class="card p-md mt-md">
    <SearchForm on:search={() => fetchCustomers(1, true)} />
  </div>
  <div class="table-wrapper mt-sm mb-md">
    <table class="table">
      <thead>
        <tr>
          <th class="clickable" on:click={() => onClickSort('ID')}>
            <span>ID</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'ID'}
            >
              {#if $filterAndSortArgs.field === 'ID'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th>略称</th>
          <th>名称</th>
          <th>コーディネーター</th>
          <th
            class="clickable text-right"
            on:click={() => onClickSort('SALES')}
          >
            <span>売上</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'SALES'}
            >
              {#if $filterAndSortArgs.field === 'SALES'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {#each $customers as customer}
          <tr
            class="clickable"
            class:hoverable={!notHoverable}
            on:click={() => goto(`/customers/${customer.id}`)}
          >
            <th>{customer.id}</th>
            <td>{customer.currentCustomerDetail?.nameDisp}</td>
            <td>{customer.currentCustomerDetail?.name}</td>
            <td>
              {#if customer.currentCustomerDetail}
                <div class="default-badges-wrapper py-sm">
                  {#each customer.currentCustomerDetail.mainCoordinators as mainCoordinator}
                    {@const admin = $admins.find(
                      (admin) => admin.saUserId === mainCoordinator.saUserId
                    )}
                    {#if admin}
                      <span class="badge secondary">{admin?.displayName}</span>
                    {:else}
                      <span class="badge warning">不明</span>
                    {/if}
                  {/each}
                  {#each customer.currentCustomerDetail.subCoordinators as subCoordinator}
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
              {/if}
            </td>
            <td
              class="text-right"
              class:text-warning={customer.currentCustomerDetail?.sales ===
                null}>{customer.currentCustomerDetail?.salesDisplay}</td
            >
            <td>
              <div class="default-badges-wrapper py-sm">
                {#if customer.archived}
                  <span class="badge warning">アーカイブ済み</span>
                {/if}
              </div>
            </td>
            <td on:click|stopPropagation>
              <button
                class="pin-button hoverable"
                class:pinned={customer.pinned}
                on:pointerover={() => (notHoverable = true)}
                on:pointerleave={() => (notHoverable = false)}
                on:click={() => onClickPin(customer)}
              >
                <Fa icon={faThumbTack} size="lg" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <CommonPagination
    pageInfo={$pageInfo}
    on:clickPage={(e) => onClickPage(e.detail)}
  />
</section>

<style lang="scss">
  .pin-button {
    padding: 10px;
    color: $color-gray;
    transform: rotate(45deg);
    opacity: 0.5;
    transition: all 0.3s;

    &.pinned {
      color: $color-tertiary;
      opacity: 1;
    }
  }
</style>
