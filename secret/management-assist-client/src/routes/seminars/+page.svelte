<script lang="ts">
  import { faChalkboardUser } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'
</script>

<svelte:head>
  <title>研修 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faChalkboardUser} />
      <span class="ml-sm">研修</span>
    </h1>
  </div>
  <h2 class="text-warning">TODO: Next Phase</h2>
</section>
