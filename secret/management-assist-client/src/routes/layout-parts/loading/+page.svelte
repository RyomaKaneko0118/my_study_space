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
  {#if loading}
    <div class="loading-wrapper">
      <div class="loader" />
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

  .loader {
    position: relative;
    width: 30px;
    height: 30px;
  }

  .loader::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 0.25em solid $color-white;
    border-top-color: $color-primary;
    animation: spinner 1.5s linear infinite;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
</style>
