<script lang="ts">
  export let items: {
    label: string
  }[]
  export let currentTabIndex = 0
</script>

<ul>
  {#each items as item, i}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <li
      class:active={currentTabIndex === i}
      on:click={() => (currentTabIndex = i)}
    >
      {item.label}
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    width: 100%;
    display: flex;
    gap: 0 5px;
    background-color: $color-white;
    border-radius: 5px;
    box-shadow: $box-shadow;
    overflow-x: auto;
    font-size: $font-size-sm;

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      height: 30px;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      color: $color-gray;
      opacity: 0.6;
      cursor: pointer;
      position: relative;

      &.active {
        color: $color-primary;
        opacity: 1;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: $color-primary;
        }
      }
    }
  }
</style>
