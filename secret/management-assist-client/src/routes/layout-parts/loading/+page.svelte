<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonLoading from '$lib/components/CommonLoading.svelte'
  let loading = false
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>ローディング</h1>
  <div class="default-btn-fit-wrapper mt-sm">
    <CommonButton outline on:click={() => (loading = !loading)}
      >ローディング</CommonButton
    >
  </div>
  {#if loading}
    <div class="loading-wrapper">
      <CommonLoading />
    </div>
  {/if}
</section>

<style lang="scss">
  .loading-wrapper {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
