<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonRadioButton from '$lib/components/CommonRadioButton.svelte'
  let autoUpdate = false

  const resetError = () => {
    console.log('resetError')
  }
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>{autoUpdate}</h1>
  <div class="input-group mt-md">
    <label for="seatMapSize">自動更新</label>
    <CommonRadioButton
      bind:modelValue={autoUpdate}
      class="mr-md"
      value={true}
      label="有効"
      on:input={resetError}
    />
    <CommonRadioButton
      bind:modelValue={autoUpdate}
      class="mr-md"
      value={false}
      label="無効"
      on:input={resetError}
    />
  </div>
  <div class="parts-wrapper">
    <div class="input-group mt-md">
      <label for="seatMapSize">自動更新</label>
      <CommonRadioButton
        bind:modelValue={autoUpdate}
        class="mr-md"
        value={true}
        label="有効"
        on:input={resetError}
      />
      <CommonRadioButton
        bind:modelValue={autoUpdate}
        class="mr-md"
        value={false}
        label="無効"
        on:input={resetError}
      />
    </div>
  </div>
</section>

<style lang="scss">
  .parts-wrapper {
    width: 300px;
  }
</style>
