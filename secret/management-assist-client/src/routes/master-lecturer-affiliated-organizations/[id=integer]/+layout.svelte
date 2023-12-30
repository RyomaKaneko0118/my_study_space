<script lang="ts">
  import { onMount, tick } from 'svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { beforeNavigate } from '$app/navigation'

  import { breadcrumbName } from '$stores/app'
  import { masterLecturerAffiliatedOrganization } from '$stores/master-lecturer-affiliated-organizations'

  beforeNavigate(async (navigation) => {
    await tick()
    if (
      navigation.to?.route.id?.startsWith(
        '/master-lecturer-affiliated-organizations/[id=integer]'
      )
    ) {
      breadcrumbName.set($masterLecturerAffiliatedOrganization.name)
    }
  })

  onMount(() => {
    breadcrumbName.set($masterLecturerAffiliatedOrganization.name)
  })
</script>

<svelte:head>
  <title>{$masterLecturerAffiliatedOrganization.name} | {PUBLIC_TITLE}</title>
</svelte:head>

<slot />
