<script lang="ts">
  export let variant: 'default' | 'light' = 'default'
  export let id: string | null = null
  export let name: string | null = null
  export let value: string | number | boolean | null | undefined
  export let options: OptionType[] = []
  export let disabled = false
  export let invalid = false
  export { className as class }

  type OptionType = {
    label: string
    value?: string | number | boolean
    selected?: boolean
    disabled?: boolean
  }

  let className = ''
</script>

<select
  {id}
  {name}
  {disabled}
  class="{className} select-{variant}"
  class:invalid
  bind:value
  on:input
  on:change
>
  {#each options as option}
    <option
      value={option.value}
      selected={option.selected}
      disabled={option.disabled}>{option.label}</option
    >
  {/each}
</select>

<style scoped lang="scss">
  select {
    width: 100%;
    height: 40px;
    padding: 0 15px;
    border: 1px solid $color-border;
    border-radius: 3px;
    line-height: $line-height-sm;
    display: flex;
    align-items: center;
    outline: none;
    appearance: none;

    &.select-default {
      background-color: $color-background;
    }

    &.select-light {
      background-color: $color-white;
    }

    &:disabled {
      opacity: 0.5;
    }

    &.invalid {
      border-color: $color-error;
    }
  }
</style>
