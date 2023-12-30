<script lang="ts">
  import { slide } from 'svelte/transition'

  export { className as class }

  let className = ''
  let showMenu = false

  const toggleMenu = () => {
    showMenu = !showMenu
  }
</script>

<svelte:window on:click={() => (showMenu = false)} />

<div class="{className} drop-down-wrapper">
  <button class="dropdown" on:click|stopPropagation={toggleMenu}>
    <slot name="toggle" />
  </button>
  {#if showMenu}
    <ul class="dropdown-menu" transition:slide>
      <slot name="menu-items" />
    </ul>
  {/if}
</div>

<style lang="scss">
  .drop-down-wrapper {
    position: relative;
  }

  .dropdown-menu {
    z-index: 2;
    position: absolute;
    top: 100%;
    right: 0;
    white-space: nowrap;
    background-color: $color-white;
    border-radius: 5px;
    box-shadow: $box-shadow;

    &::after {
      content: '';
      position: absolute;
      display: block;
      height: 10px;
      width: 100%;
      background-color: transparent;
      pointer-events: none;
    }
  }
</style>
