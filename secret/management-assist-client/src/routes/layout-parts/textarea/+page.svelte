<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonTextarea from '$lib/components/CommonTextarea.svelte'
  const errors = {
    note: false
  }
  let note = ''

  const resetError = () => {
    errors.note = false
  }
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>{note}</h1>
  <CommonTextarea
    id="note"
    resizable
    invalid={!!errors.note}
    bind:value={note}
    on:input={resetError}
  />
  <div class="d-flex justify-content-center mt-sm">
    <div class="textarea-wrapper">
      <CommonTextarea
        id="note"
        resizable
        invalid={!!errors.note}
        bind:value={note}
        on:input={resetError}
      />
    </div>
  </div>
</section>

<style lang="scss">
  .textarea-wrapper {
    width: 660px;
  }
</style>
