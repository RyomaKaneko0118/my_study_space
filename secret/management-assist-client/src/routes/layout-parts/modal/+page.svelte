<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  let showArchiveConfirmModalWithToState: boolean | null = null
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>モーダル</h1>
  <div class="d-flex justify-content-start">
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton
        variant="primary"
        on:click={() => (showArchiveConfirmModalWithToState = true)}
        >アーカイブ確認モーダル</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper">
      <CommonButton
        variant="primary"
        on:click={() => (showArchiveConfirmModalWithToState = false)}
        >アーカイブ解除確認モーダル</CommonButton
      >
    </div>
  </div>

  <CommonModal
    show={showArchiveConfirmModalWithToState !== null}
    title="確認"
    on:close={() => (showArchiveConfirmModalWithToState = null)}
  >
    <div>
      {#if showArchiveConfirmModalWithToState}
        <p>本当にアーカイブしてもよろしいですか？</p>
        <p>アーカイブするとbordとの同期処理を停止します。</p>
      {:else}
        <p>本当にのアーカイブを解除してもよろしいですか？</p>
        <p>アーカイブを解除するとbordとの同期処理を再開します。</p>
      {/if}
    </div>
    <div slot="footer" class="d-flex">
      <div class="default-btn-fit-wrapper mr-sm">
        <CommonButton
          outline
          on:click={() => (showArchiveConfirmModalWithToState = null)}
          >キャンセル</CommonButton
        >
      </div>
      <div class="default-btn-fit-wrapper">
        {#if showArchiveConfirmModalWithToState}
          <CommonButton
            variant="primary"
            on:click={() => {
              showArchiveConfirmModalWithToState = null
              window.confirm('アーカイブしました')
            }}>アーカイブ</CommonButton
          >
        {:else}
          <CommonButton
            variant="secondary"
            on:click={() => {
              showArchiveConfirmModalWithToState = null
              window.confirm('アーカイブ解除しました')
            }}>アーカイブ解除</CommonButton
          >
        {/if}
      </div>
    </div>
  </CommonModal>
</section>

<style lang="scss">
</style>
