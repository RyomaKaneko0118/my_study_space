<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'
  let includeArchived = false
  let pinnedOnly = false
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>ボタン</h1>
  <CommonCheckbox bind:value={includeArchived} checked={includeArchived}>
    <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
  </CommonCheckbox>
  <CommonCheckbox bind:value={pinnedOnly} checked={pinnedOnly}>
    <span class="ml-sm text-gray fw-bold">ピン留めのみ</span>
  </CommonCheckbox>
  <div class="parts-row mx-auto">
    <div class="parts-column">
      <CommonCheckbox bind:value={includeArchived} checked={includeArchived}>
        <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
      </CommonCheckbox>
    </div>
    <div class="parts-column">
      <CommonCheckbox bind:value={pinnedOnly} checked={pinnedOnly}>
        <span class="ml-sm text-gray fw-bold">ピン留めのみ</span>
      </CommonCheckbox>
    </div>
    <div class="parts-column">
      <CommonCheckbox bind:value={includeArchived} checked={includeArchived}>
        <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
      </CommonCheckbox>
    </div>
    <div class="parts-column">
      <CommonCheckbox bind:value={pinnedOnly} checked={pinnedOnly}>
        <span class="ml-sm text-gray fw-bold">ピン留めのみ</span>
      </CommonCheckbox>
    </div>
    <div class="parts-column">
      <CommonCheckbox bind:value={includeArchived} checked={includeArchived}>
        <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
      </CommonCheckbox>
    </div>
    <div class="parts-column">
      <CommonCheckbox bind:value={pinnedOnly} checked={pinnedOnly}>
        <span class="ml-sm text-gray fw-bold">ピン留めのみ</span>
      </CommonCheckbox>
    </div>
    <div class="parts-column">
      <CommonCheckbox bind:value={includeArchived} checked={includeArchived}>
        <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
      </CommonCheckbox>
    </div>
    <div class="parts-column">
      <CommonCheckbox bind:value={pinnedOnly} checked={pinnedOnly}>
        <span class="ml-sm text-gray fw-bold">ピン留めのみ</span>
      </CommonCheckbox>
    </div>
  </div>
</section>

<style lang="scss">
  .parts-row {
    padding: 0 10px 20px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px 40px;
  }

  .parts-column {
    display: flex;
    align-items: center;
  }
</style>
