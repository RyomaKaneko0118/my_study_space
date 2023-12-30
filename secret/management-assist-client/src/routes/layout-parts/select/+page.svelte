<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonSelect from '$lib/components/CommonSelect.svelte'

  const selectOptions = [
    {
      label: '指定なし'
    },
    {
      label: 'alice',
      value: 1
    },
    {
      label: 'bob',
      value: 2
    },
    {
      label: 'nobu',
      value: 3
    }
  ]

  let selectedValue = ''
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>{selectedValue}</h1>
  <CommonSelect
    id="coordinator"
    options={selectOptions}
    bind:value={selectedValue}
  />
  <div class="d-flex justify-content-center">
    <div class="select-wrapper">
      <CommonSelect
        id="coordinator"
        options={selectOptions}
        bind:value={selectedValue}
      />
    </div>
  </div>
</section>

<style lang="scss">
  .select-wrapper {
    width: 660px;
  }
</style>
