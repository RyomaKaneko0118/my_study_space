<script lang="ts">
  export let id: string | null = null
  export let name: string | null = null
  export let modelValue: string | number | boolean | Date | null | undefined
  export let value: string | number | boolean | Date | null | undefined
  export let disabled = false
  export let label = ''

  export { className as class }

  let input: HTMLInputElement
  let className = ''
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
  class="radio-button-wrapper {className}"
  class:disabled
  on:click={() => input.click()}
>
  <input
    type="radio"
    {id}
    {name}
    {disabled}
    {value}
    checked={modelValue === value}
    bind:this={input}
    on:input
    on:change={() => {
      modelValue = value
    }}
  />
  <span class="radio-button" />
  <label for={id}>{label}</label>
</span>

<style lang="scss">
  .radio-button-wrapper {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &.disabled,
    &.disabled label {
      cursor: auto;
      opacity: 0.5;
    }
  }

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
</style>
