<script lang="ts">
  import { onMount, tick } from 'svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { beforeNavigate } from '$app/navigation'

  import { breadcrumbName } from '$stores/app'
  import { customer } from '$stores/customers'

  beforeNavigate(async (navigation) => {
    await tick()
    if (
      navigation.to?.route.id?.startsWith('/customers/[id=integer]') &&
      $customer.currentCustomerDetail
    ) {
      breadcrumbName.set($customer.currentCustomerDetail.name)
    }
  })

  onMount(() => {
    if ($customer.currentCustomerDetail) {
      breadcrumbName.set($customer.currentCustomerDetail.name)
    }
  })
</script>

<svelte:head>
  {#if $customer.currentCustomerDetail}
    <title>{$customer.currentCustomerDetail.name} | {PUBLIC_TITLE}</title>
  {/if}
</svelte:head>

<slot />
