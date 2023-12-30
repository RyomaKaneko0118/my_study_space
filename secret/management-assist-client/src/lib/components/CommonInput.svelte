<script lang="ts">
  export let type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'datetime-local'
    | 'color' = 'text'
  export let variant: 'default' | 'light' = 'default'
  export let id: string | null = null
  export let name: string | null = null
  export let value: string | number | Date | null | undefined
  export let autocomplete: string | null = null
  export let placeholder: string | null = null
  export let disabled = false
  export let invalid = false
  export let readonly = false
  export let step: number | null = null
  export let min: string | null = null
  export { className as class }

  let className = ''

  const setType = (node: HTMLInputElement) => {
    node.type = type
  }
</script>

<input
  {id}
  {name}
  {autocomplete}
  {placeholder}
  {step}
  {min}
  {disabled}
  {readonly}
  class="{className} input-{variant}"
  class:invalid
  bind:value
  on:input
  on:click
  use:setType
/>

<style lang="scss">
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

    &.input-default {
      background-color: $color-background;
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
</style>
