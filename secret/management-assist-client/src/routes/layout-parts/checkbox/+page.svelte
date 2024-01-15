<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'

  let includeArchived = false
  let pinnedOnly = false
  let input: HTMLInputElement
  let value = false

  const onInput = () => {
    value = input.checked
  }
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
  <div class="parts-row">
    <div class="parts-column">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="checkbox-wrapper" on:click={() => input.click()}>
        <input
          type="checkbox"
          bind:value={includeArchived}
          checked={includeArchived}
          bind:this={input}
          on:input={onInput}
          on:change
        />
        <span class="checkbox" />
        <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
      </span>
    </div>
    <div class="parts-column">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="checkbox-wrapper" on:click={() => input.click()}>
        <input
          type="checkbox"
          bind:value={includeArchived}
          checked={includeArchived}
          bind:this={input}
          on:input={onInput}
          on:change
        />
        <span class="checkbox" />
        <span class="ml-sm text-gray fw-bold">アーカイブを含める</span>
      </span>
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

  .checkbox-wrapper {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    input[type='checkbox'] {
      display: none;
    }

    .checkbox {
      position: relative;
      width: 20px;
      height: 20px;
      background-color: $color-white;
      border: 1px solid $color-border;
      border-radius: 2px;
      transition: all 0.3s;

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 3px;
        left: 3px;
        width: 12px;
        height: 8px;
        border-left: 2px solid $color-white;
        border-bottom: 2px solid $color-white;
        transition: all 0.3s;
        transform: rotate(0) scale(0);
      }
    }

    input:checked + .checkbox {
      background-color: $color-primary;
      border-color: $color-primary;
      &::after {
        transform: rotate(-45deg) scale(1);
      }
    }
  }
</style>
