<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  export let show = false
  export let title = '確認'
  export let message = ''
  export let correctId: number

  $: if (show) {
    inputCorrectId = ''
    invalidCorrectId = false
  }

  const dispatch = createEventDispatcher()

  const onClickDelete = () => {
    if (Number(inputCorrectId) !== correctId) {
      invalidCorrectId = true
      return
    }

    dispatch('submit')
  }

  let inputCorrectId = ''
  let invalidCorrectId = false
</script>

<CommonModal {show} {title} {message} on:close>
  <div class="input-group">
    <CommonInput
      id="correctId"
      variant="light"
      placeholder="IDを入力してください"
      bind:value={inputCorrectId}
      on:input={() => (invalidCorrectId = false)}
    />
    {#if invalidCorrectId}
      <p class="mt-xs text-right text-error fs-sm">
        入力されたIDが間違っています
      </p>
    {/if}
  </div>
  <div slot="footer" class="d-flex">
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton outline on:click={() => dispatch('close')}
        >キャンセル</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper">
      <CommonButton
        variant="danger"
        disabled={!inputCorrectId}
        on:click={onClickDelete}>削除</CommonButton
      >
    </div>
  </div>
</CommonModal>

<style lang="scss">
  .input-group {
    max-width: 400px;
    margin: 20px auto 0 auto;
    text-align: left;
  }
</style>
