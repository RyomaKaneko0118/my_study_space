<script lang="ts">
  export let type: 'button' | 'submit' = 'button'
  export let variant: 'light' | 'primary' | 'secondary' | 'warning' | 'danger' =
    'light'
  export let size: 'md' | 'sm' | 'xs' = 'md'
  export let outline = false
  export let disabled = false
  export { className as class }

  let className = ''

  const setType = (node: HTMLButtonElement) => {
    console.log(node)
    console.log(node.type)
    node.type = type
    console.log(node.type)
  }
</script>

<button
  {disabled}
  class="{className} btn-{size} btn-{variant}"
  class:outline
  on:click
  use:setType
>
  <slot />
</button>

<style lang="scss">
  button {
    width: 100%;
    padding: 0 20px;
    border: 1px solid;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;

    @media (hover: hover) {
      &:hover {
        transition: box-shadow 0.3s;
        box-shadow: 0 5px 11px 0 rgba($color: $color-black, $alpha: 0.18),
          0 4px 15px 0 rgba($color: $color-black, $alpha: 0.15);
      }
    }

    &.btn-md {
      height: 46px;
      font-size: $font-size-md;
    }

    &.btn-sm {
      height: 36px;
      font-size: $font-size-sm;
    }

    &.btn-xs {
      height: 24px;
      padding: 0 10px;
      font-size: $font-size-xs;
    }

    &.btn-light {
      color: $color-gray;
      background-color: $color-white;
      border-color: $color-gray;
    }

    &.btn-primary {
      color: $color-white;
      background-color: $color-primary;
      border-color: $color-primary;

      &.outline {
        color: $color-primary;
        background-color: $color-white;
        border-color: $color-primary;
      }
    }

    &.btn-secondary {
      color: $color-white;
      background-color: $color-secondary;
      border-color: $color-secondary;

      &.outline {
        color: $color-secondary;
        background-color: $color-white;
        border-color: $color-secondary;
      }
    }

    &.btn-warning {
      color: $color-white;
      background-color: $color-warning;
      border-color: $color-warning;

      &.outline {
        color: $color-warning;
        background-color: $color-white;
        border-color: $color-warning;
      }
    }

    &.btn-danger {
      color: $color-white;
      background-color: $color-error;
      border-color: $color-error;

      &.outline {
        color: $color-error;
        background-color: $color-white;
        border-color: $color-error;
      }
    }

    &:disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
</style>
