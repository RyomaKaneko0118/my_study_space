<script lang="ts">
  import { onMount, tick } from 'svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { beforeNavigate } from '$app/navigation'

  import { breadcrumbName } from '$stores/app'
  import { masterSeminarDomain } from '$stores/master-seminar-domains'

  beforeNavigate(async (navigation) => {
    await tick()
    if (
      navigation.to?.route.id?.startsWith(
        '/master-seminar-domains/[id=integer]'
      )
    ) {
      breadcrumbName.set($masterSeminarDomain.name)
    }
  })

  onMount(() => {
    breadcrumbName.set($masterSeminarDomain.name)
  })
</script>

<svelte:head>
  <title>{$masterSeminarDomain.name} | {PUBLIC_TITLE}</title>
</svelte:head>

<slot />
