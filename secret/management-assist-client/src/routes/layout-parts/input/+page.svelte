<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonInput from '$lib/components/CommonInput.svelte'

  let inputCorrectId = ''
  let invalidCorrectId = false
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>{inputCorrectId}</h1>
  <CommonInput
    id="correctId"
    variant="light"
    placeholder="IDを入力してください"
    bind:value={inputCorrectId}
    on:input={() => (invalidCorrectId = false)}
  />
  {#if invalidCorrectId}
    <p class="mt-xs text-right text-error fs-sm">
      入力されたIDが間違っています
    </p>
  {/if}
  <div class="d-flex justify-content-center">
    <div class="input-group mt-sm">
      <CommonInput
        id="correctId"
        variant="light"
        placeholder="IDを入力してください"
        bind:value={inputCorrectId}
        on:input={() => (invalidCorrectId = false)}
      />
      {#if invalidCorrectId}
        <p class="mt-xs text-right text-error fs-sm">
          入力されたIDが間違っています
        </p>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  .input-group {
    width: 100%;
    max-width: 660px;
    display: flex;
    align-items: center;
  }
</style>
