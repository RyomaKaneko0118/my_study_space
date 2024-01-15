<script lang="ts">
  import { onMount, tick } from 'svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { beforeNavigate } from '$app/navigation'

  import { breadcrumbName } from '$stores/app'
  import { lecturer } from '$stores/lecturers'

  beforeNavigate(async (navigation) => {
    await tick()
    if (navigation.to?.route.id?.startsWith('/lecturers/[id=integer]')) {
      breadcrumbName.set($lecturer.fullName)
    }
  })

  onMount(() => {
    breadcrumbName.set($lecturer.fullName)
  })
</script>

<svelte:head>
  <title>{$lecturer.fullName} | {PUBLIC_TITLE}</title>
</svelte:head>

<slot />
