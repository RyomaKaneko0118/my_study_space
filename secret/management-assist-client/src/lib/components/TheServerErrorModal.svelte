<script lang="ts">
  import { serverError } from '$stores/app'

  import CommonModal from '$lib/components/CommonModal.svelte'

  const onCloseServerErrorModal = () => {
    serverError.set(false)
  }
</script>

<CommonModal
  show={$serverError}
  title="エラー"
  message="サーバーエラーが発生しました。"
  on:close={onCloseServerErrorModal}
/>
