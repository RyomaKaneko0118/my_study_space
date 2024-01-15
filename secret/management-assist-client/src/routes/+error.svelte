<script lang="ts">
  import { PUBLIC_TITLE } from '$env/static/public'

  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content mt-xl pt-xl text-center">
  {#if $page.status === 403}
    <div class="text-error mb-lg">
      <h1>403 Forbidden</h1>
      <h2>指定されたページへのアクセス権限がありません</h2>
    </div>
  {:else if $page.status === 404}
    <div class="text-primary mb-lg">
      <h1>404 Not Found</h1>
      <h2>ページが見つかりませんでした</h2>
    </div>
    <p>指定されたページは削除、またはURLが変更されているため</p>
    <p>見つけることができませんでした。</p>
  {:else}
    <div class="text-error mb-lg">
      <h1>500 Internal Server Error</h1>
      <h2>エラーが発生しました</h2>
    </div>
    <p>{$page.error?.message}</p>
  {/if}
</section>
