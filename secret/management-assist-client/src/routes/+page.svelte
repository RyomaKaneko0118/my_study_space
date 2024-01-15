<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonTab from '$lib/components/CommonTab.svelte'

  $: tabItems = [
    { label: String(2023) },
    { label: String(2022) },
    { label: String(2021) }
  ]

  let currentCustomerDetailTabIndex = 0
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>Hello</h1>
  <div class="mt-sm">
    <CommonTab
      items={tabItems}
      bind:currentTabIndex={currentCustomerDetailTabIndex}
    />
  </div>
</section>

<style lang="scss">
</style>
