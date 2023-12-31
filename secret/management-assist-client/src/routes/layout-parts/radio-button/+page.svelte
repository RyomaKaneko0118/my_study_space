<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonRadioButton from '$lib/components/CommonRadioButton.svelte'

  let autoUpdate
  let input: HTMLInputElement
  let input2: HTMLInputElement
  let value: string | number | boolean | Date | null | undefined
  let modelValue: string | number | boolean | Date | null | undefined

  $: autoUpdate

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
  <div class="parts-wrapper">
    <div class="input-group mt-md">
      <label for="seatMapSize">自動更新</label>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="radio-button-wrapper mr-md" on:click={() => input.click()}>
        <input
          type="radio"
          checked={autoUpdate === true}
          bind:this={input}
          on:input={resetError}
          on:change={() => {
            autoUpdate = true
          }}
        />
        <span class="radio-button" />
        <label>有効</label>
      </span>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="radio-button-wrapper mr-md" on:click={() => input2.click()}>
        <input
          type="radio"
          checked={autoUpdate === false}
          bind:this={input2}
          on:input={resetError}
          on:change={() => {
            autoUpdate = false
          }}
        />
        <span class="radio-button" />
        <label>無効</label>
      </span>
    </div>
  </div>
</section>

<style lang="scss">
  .parts-wrapper {
    width: 100%;
    max-width: 300px;
  }

  .radio-button-wrapper {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    input[type='radio'] {
      display: none;
    }

    label {
      width: auto !important;
      cursor: pointer;
      margin-left: 10px;
    }

    .radio-button {
      display: inline-block;
      position: relative;
      width: 18px;
      height: 18px;
      background-color: $color-white;
      border: 2px solid $color-border;
      border-radius: 50%;

      &::after {
        content: '';
        position: absolute;
        left: 1px;
        top: 1px;
        display: inline-block;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        background-color: $color-secondary;
        transform: scale(0);
        transition: transform 0.3s;
      }
    }

    input[type='radio']:checked + .radio-button::after {
      transform: scale(1);
    }
  }
</style>
