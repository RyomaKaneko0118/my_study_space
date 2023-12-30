<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export { className as class }

  let className = ''

  const dispatch = createEventDispatcher()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
  class="{className} dropdown-item hoverable"
  on:click={() => dispatch('click')}
>
  <slot />
</li>

<style lang="scss">
  .dropdown-item {
    cursor: pointer;
    padding: 10px 20px;
  }
</style>
