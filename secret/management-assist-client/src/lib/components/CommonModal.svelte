<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import CommonButton from '$lib/components/CommonButton.svelte'

  export let show = false
  export let full = false
  export let noCloseOnBackdrop = false
  export let noFooter = false
  export let title = ''
  export let message = ''

  let node: HTMLDialogElement

  // TODO
  // dialogについて調べる

  const dispatch = createEventDispatcher()

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
    if (noCloseOnBackdrop) return
    dispatch('close')
  }
</script>

<dialog bind:this={node} class={show ? 'show' : 'close'}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" class:full on:click|self={onClickBackdrop}>
    <div class="modal-content">
      {#if title}
        <div class="modal-header">{title}</div>
      {/if}
      <div class="modal-body">
        {message}
        <slot />
      </div>
      {#if !noFooter}
        <div class="modal-footer">
          <slot name="footer" />
          {#if !$$slots.footer}
            <div class="default-btn-wrapper">
              <CommonButton on:click={() => dispatch('close')}
                >閉じる</CommonButton
              >
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</dialog>

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

        &.full {
          transform: translateY(20px);
        }
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

      &.full {
        max-height: calc(100vh - 40px);

        > .modal-content {
          width: calc(100% - 20px);
          max-width: none;
          height: 100%;
          margin: 0 10px;
          padding: 0 0 10px 0;

          > .modal-body {
            padding: 0;
          }

          > .modal-footer {
            padding-top: 10px;
          }
        }
      }
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
