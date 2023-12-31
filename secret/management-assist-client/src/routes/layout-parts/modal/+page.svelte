<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonButton from '$lib/components/CommonButton.svelte'
  // import CommonModal from '$lib/components/CommonModal.svelte'

  let node: HTMLDialogElement
  let showArchiveConfirmModalWithToState: boolean | null = null
  let show = showArchiveConfirmModalWithToState !== null
  const dispatch = createEventDispatcher()

  $: show = showArchiveConfirmModalWithToState !== null
  $: toggleModal(show)

  const toggleModal = (show: boolean) => {
    if (!node) return
    if (show) {
      node.showModal()
    } else {
      setTimeout(() => {
        node.close()
      }, 250)
    }
  }

  const onClickBackdrop = () => {
    dispatch('close')
  }
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>モーダル</h1>
  <h2>{showArchiveConfirmModalWithToState}</h2>
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

  <!-- <CommonModal
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
  </CommonModal> -->
  <dialog
    bind:this={node}
    class={show ? 'show' : 'close'}
    on:close={() => (showArchiveConfirmModalWithToState = null)}
  >
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">確認</div>
        <div class="modal-body">
          <div>
            {#if showArchiveConfirmModalWithToState}
              <p>本当にアーカイブしてもよろしいですか？</p>
              <p>アーカイブするとbordとの同期処理を停止します。</p>
            {:else}
              <p>本当にのアーカイブを解除してもよろしいですか？</p>
              <p>アーカイブを解除するとbordとの同期処理を再開します。</p>
            {/if}
          </div>
        </div>
        <div class="modal-footer">
          <div class="d-flex">
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
        </div>
      </div>
    </div>
  </dialog>
</section>

<style lang="scss">
  dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    &::backdrop {
      opacity: 0;
      background-color: $color-black;
      transition: all 0.25s linear;
    }

    &.show {
      &::backdrop {
        opacity: 0.6;
      }

      > .modal {
        opacity: 1;
        transform: translateY(50px);
      }
    }

    &.close {
      &::backdrop {
        opacity: 0;
      }

      > .modal {
        opacity: 0;
        transform: translateY(-50px);

        &.full {
          transform: translateY(-20px);
        }
      }
    }

    > .modal {
      width: 100%;
      height: 100%;
      max-height: calc(100vh - 100px);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      transition: all 0.25s linear;
    }

    .modal-content {
      max-width: 90%;
      max-height: 100%;
      padding: 50px 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
      background-color: $color-background;
      border-radius: 5px;

      @include mq(lg) {
        max-width: 700px;
      }
    }

    .modal-header {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      word-break: keep-all;
      margin-bottom: 30px;
    }

    .modal-body {
      flex-grow: 1;
      overflow: auto;
      padding: 0 20px;
    }

    .modal-footer {
      padding-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
