<script lang="ts">
  export let id: string | null = null
  export let name: string | null = null
  export let value = false
  export let checked = false
  export let disabled = false

  export { className as class }

  let input: HTMLInputElement
  let className = ''

  const onInput = () => {
    value = input.checked
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
  class="checkbox-wrapper {className}"
  class:disabled
  on:click={() => input.click()}
>
  <input
    type="checkbox"
    {id}
    {name}
    {checked}
    {disabled}
    {value}
    bind:this={input}
    on:input={onInput}
    on:change
  />
  <span class="checkbox" />
  <slot />
</span>

<style lang="scss">
  .checkbox-wrapper {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &.disabled {
      cursor: auto;
      opacity: 0.5;
    }

    input[type='checkbox'] {
      display: none;
    }

    .checkbox {
      position: relative;
      width: 20px;
      height: 20px;
      background-color: $color-white;
      border: 1px solid $color-border;
      border-radius: 2px;
      transition: all 0.3s;

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 3px;
        left: 3px;
        width: 12px;
        height: 8px;
        border-left: 2px solid $color-white;
        border-bottom: 2px solid $color-white;
        transition: all 0.3s;
        transform: rotate(0) scale(0);
      }
    }

    input:checked + .checkbox {
      background-color: $color-primary;
      border-color: $color-primary;
      &::after {
        transform: rotate(-45deg) scale(1);
      }
    }
  }
</style>
