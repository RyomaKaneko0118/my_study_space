<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import type { PageInfo } from '$lib/models'

  export let pageInfo: PageInfo

  let allPages: number[] = []
  let displayPages: number[] = []
  let omitPrev = false
  let omitNext = false

  const dispachClickPage = createEventDispatcher<{ clickPage: number }>()

  $: if (pageInfo) {
    allPages = [...Array(Math.ceil(pageInfo.totalCount / pageInfo.take))].map(
      (_, i) => i + 1
    )
    displayPages = allPages.filter((page) => {
      if (pageInfo.currentPage === page) {
        return true
      } else if (pageInfo.currentPage > page) {
        return pageInfo.currentPage - page < 3
      } else {
        return page - pageInfo.currentPage < 3
      }
    })
    omitPrev =
      allPages.filter((page) => {
        return pageInfo.currentPage - 3 >= page
      }).length !== 0
    omitNext =
      allPages.filter((page) => {
        return pageInfo.currentPage + 3 <= page
      }).length !== 0
  }
</script>

{#if pageInfo}
  <div class="pagination">
    <button
      class:disabled={!pageInfo.hasPrevPage}
      on:click={() => dispachClickPage('clickPage', pageInfo.currentPage - 1)}
    >
      <span class="arrow-left" />
    </button>
    {#if omitPrev}
      <button on:click={() => dispachClickPage('clickPage', 1)}>1</button>
      <span>..</span>
    {/if}
    {#each displayPages as page}
      <button
        class:active={page === pageInfo.currentPage}
        on:click={() => dispachClickPage('clickPage', page)}
      >
        {page}
      </button>
    {/each}
    {#if omitNext}
      <span>..</span>
      <button
        on:click={() => dispachClickPage('clickPage', allPages.slice(-1)[0])}
      >
        {allPages.slice(-1)[0]}
      </button>
    {/if}
    <button
      class:disabled={!pageInfo.hasNextPage}
      on:click={() => dispachClickPage('clickPage', pageInfo.currentPage + 1)}
    >
      <span class="arrow-right" />
    </button>
  </div>
{/if}

<style lang="scss">
  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      margin: 0 5px;
      padding: 0 0 5px 0;
      box-shadow: none;

      &.active {
        color: $color-primary;
        pointer-events: none;
        border-bottom: 1px solid $color-primary;
      }

      &.disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      .arrow-right,
      .arrow-left {
        position: relative;
        display: inline-block;
        width: 100%;

        &::before {
          content: '';
          width: 8px;
          height: 8px;
          border-top: solid 1px $color-gray;
          border-right: solid 1px $color-gray;
          position: absolute;
          top: -10px;
        }
      }

      .arrow-left::before {
        left: -7px;
        transform: rotate(225deg);
      }

      .arrow-right::before {
        right: -4px;
        transform: rotate(45deg);
      }
    }
  }
</style>
