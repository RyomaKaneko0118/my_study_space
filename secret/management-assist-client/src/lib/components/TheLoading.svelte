<script lang="ts">
  import { loading } from '$stores/app'
  let node: HTMLDialogElement

  $: toggleLoading($loading)

  const toggleLoading = (loading: boolean) => {
    if (!node) return

    if (loading && !node.open) {
      node.showModal()
    } else if (!loading && node.open) {
      node.close()
    }
  }
</script>

<dialog bind:this={node}>
  <div class="loader" />
</dialog>

<style scoped lang="scss">
  dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    &::backdrop {
      opacity: 0.5;
      background-color: $color-black;
    }
  }

  .loader::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5em;
    height: 5em;
    margin-top: -2.5em;
    margin-left: -2.5em;
    border-radius: 50%;
    border: 0.25em solid $color-white;
    border-top-color: $color-primary;
    animation: spinner 1.5s linear infinite;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
</style>
