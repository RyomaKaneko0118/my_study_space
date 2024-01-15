<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { filterAndSortArgs } from '$stores/lecturers'
  import { masterLecturerCategories } from '$stores/master-lecturer-categories'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'

  let filterAndSort = { ...$filterAndSortArgs }

  const masterLecturerCategoryOptions = [
    {
      label: '指定なし'
    },
    ...$masterLecturerCategories.map((masterLecturerCategory) => {
      return {
        label: masterLecturerCategory.name,
        value: masterLecturerCategory.id
      }
    })
  ]

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
        <label for="name" class="fs-xs">
          <p>氏名・ビジネスネーム</p>
          <p>(ふりがな含む)</p>
        </label>
        <CommonInput bind:value={filterAndSort.name} />
      </div>
      <div class="search-column">
        <label for="coordinator">担当領域</label>
        <CommonSelect
          id="coordinator"
          options={masterLecturerCategoryOptions}
          bind:value={filterAndSort.masterLecturerCategoryId}
        />
      </div>
    </div>
    <div class="search-row mx-auto">
      <div class="search-column">
        <CommonCheckbox
          bind:value={filterAndSort.includeArchived}
          checked={filterAndSort.includeArchived}
        >
          <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
        </CommonCheckbox>
      </div>
      <div class="search-column">
        <CommonCheckbox
          bind:value={filterAndSort.pinnedOnly}
          checked={filterAndSort.pinnedOnly}
        >
          <span class="ml-sm text-gray fw-bold">ピン留めのみ</span>
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
