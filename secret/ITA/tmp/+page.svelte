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
        on:click={() => goto(`/customers/${$customer.id}/managers/new`)}
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
          <th>氏名</th>
          <th>部門</th>
          <th>職責</th>
          <th>担当研修</th>
          <th>メイン研修</th>
        </tr>
      </thead>
      <tbody>
        {#each $customer.managers as manager}
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
            <td>
              {#if department}
                <span class="badge">{department.name}</span>
              {/if}
            </td>
            <td>{manager.post}</td>
            <td>TODO</td>
            <td>TODO</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
