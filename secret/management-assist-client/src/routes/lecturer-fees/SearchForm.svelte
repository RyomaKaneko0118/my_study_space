<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { filterArgs } from '$stores/lecturer-details'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'

  let filter = { ...$filterArgs }

  const dispach = createEventDispatcher()

  const onClickClear = () => {
    filterArgs.set({})
    filter = { ...$filterArgs }
    dispach('search')
  }

  const onClickSearch = () => {
    filterArgs.set(filter)
    dispach('search')
  }
</script>

<div class="search-form">
  <div class="search-row-wrapper">
    <div class="search-row">
      <div class="search-column">
        <label for="name" class="fs-xs">
          <p>氏名・ビジネスネーム</p>
          <p>(ふりがな含む)</p>
        </label>
        <CommonInput bind:value={filter.name} />
      </div>
    </div>
    <div class="search-row mx-auto">
      <div class="search-column">
        <CommonCheckbox
          bind:value={filter.includeArchived}
          checked={filter.includeArchived}
        >
          <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
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
