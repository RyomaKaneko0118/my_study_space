<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { filterAndSortArgs } from '$stores/contracts'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'

  let filterAndSort = { ...$filterAndSortArgs }

  const dispach = createEventDispatcher()

  const onClickClear = () => {
    filterAndSortArgs.set({
      field: 'ID',
      direction: 'DESC'
    })
    filterAndSort = { ...$filterAndSortArgs }
    dispach('search')
  }

  const onClickSearch = () => {
    filterAndSortArgs.set(filterAndSort)
    dispach('search')
  }
</script>

<div class="search-form">
  <div class="search-row-wrapper">
    <div class="search-row mx-auto">
      <div class="search-column">
        <CommonCheckbox
          bind:value={filterAndSort.includeOrigin}
          checked={filterAndSort.includeOrigin}
        >
          <span class="ml-sm text-gray fw-bold">更新済み契約を含める</span>
        </CommonCheckbox>
      </div>
    </div>
  </div>
  <div class="d-flex">
    <div class="btn-wrapper mr-xs">
      <CommonButton size="sm" outline on:click={onClickClear}
        >クリア</CommonButton
      >
    </div>
    <div class="btn-wrapper ml-xs">
      <CommonButton variant="primary" size="sm" outline on:click={onClickSearch}
        >検索</CommonButton
      >
    </div>
  </div>
</div>
