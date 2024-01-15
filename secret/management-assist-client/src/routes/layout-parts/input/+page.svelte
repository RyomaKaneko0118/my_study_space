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
  <div class="d-flex justify-content-center parts">
    <div class="input-group mt-sm">
      <input
        id="correctId"
        placeholder="IDを入力してください"
        bind:value={inputCorrectId}
        on:input={() => (invalidCorrectId = false)}
        class="input-light"
      />
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

  .parts {
    input {
      width: 100%;
      height: 40px;
      padding: 0 15px;
      border: 1px solid $color-border;
      border-radius: 3px;
      outline: none;
      display: flex;
      align-items: center;

      &:disabled {
        opacity: 0.5;
      }

      &.input-light {
        background-color: $color-white;
      }

      &.invalid {
        border-color: $color-error;
      }

      &::placeholder {
        color: $color-gray;
      }
    }
  }
</style>
