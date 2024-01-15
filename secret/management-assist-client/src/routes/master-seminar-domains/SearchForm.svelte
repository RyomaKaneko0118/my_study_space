<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { filterAndSortArgs } from '$stores/master-seminar-domains'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'

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
    <div class="search-row">
      <div class="search-column">
        <label for="name">研修分野名</label>
        <CommonInput bind:value={filterAndSort.name} />
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
