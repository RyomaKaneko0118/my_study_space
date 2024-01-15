<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonButton from '$lib/components/CommonButton.svelte'

  const inputCorrectId = false
  const onClickDelete = () => {
    console.log('clicked')
  }
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>ボタン</h1>
  <div class="parts mt-sm">
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton outline on:click={() => console.log('clicked')}
        >キャンセル</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton
        variant="danger"
        disabled={!inputCorrectId}
        on:click={onClickDelete}>削除</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton
        variant="danger"
        disabled={!inputCorrectId}
        on:click={onClickDelete}>削除</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton
        variant="danger"
        disabled={!inputCorrectId}
        on:click={onClickDelete}>削除</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper">
      <button class="btn-md btn-danger" on:click={onClickDelete}>削除</button>
    </div>
  </div>
</section>

<style lang="scss">
  .parts {
    .default-btn-fit-wrapper {
      width: 140px;

      @include mq(lg) {
        width: 180px;
      }
    }

    @include mq(lg) {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button {
      width: 100%;
      padding: 0 20px;
      border: 1px solid;
      border-radius: 5px;
      text-align: center;
      cursor: pointer;

      @media (hover: hover) {
        &:hover {
          transition: box-shadow 0.3s;
          box-shadow: 0 5px 11px 0 rgba($color: $color-black, $alpha: 0.18),
            0 4px 15px 0 rgba($color: $color-black, $alpha: 0.15);
        }
      }

      &.btn-md {
        height: 46px;
        font-size: $font-size-md;
      }

      &.btn-danger {
        color: $color-white;
        background-color: $color-error;
        border-color: $color-error;
      }
    }
  }
</style>
