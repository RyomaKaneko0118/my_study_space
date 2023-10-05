<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'

  import { customer } from '$stores/customers'

  import CommonButton from '$lib/components/CommonButton.svelte'
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
    <div>
      <CommonButton
        variant="primary"
        size="sm"
        on:click={() => goto(`/customers/${$customer.id}/departments/new`)}
      >
        <Fa icon={faPlus} />
        <span class="ml-xs">登録</span>
      </CommonButton>
    </div>
  </div>
  <div class="table-wrapper my-md">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>部門名</th>
          <th>取引年数</th>
          <th>担当者</th>
        </tr>
      </thead>
      <tbody>
        {#each $customer.departments as department}
          <tr
            class="clickable hoverable"
            on:click={() =>
              goto(`/customers/${$customer.id}/departments/${department.id}`)}
          >
            <th>{department.id}</th>
            <td>{department.name}</td>
            <td>{department.dealingPeriod}年</td>
            <td>
              <div class="default-badges-wrapper">
                {#each $customer.managers as manager}
                  {#if department.id === manager.departmentId}
                    <span class="badge secondary">{manager.lastName}</span>
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
