<script lang="ts">
  import { onMount, tick } from 'svelte'

  import { beforeNavigate } from '$app/navigation'

  import { breadcrumbSecondName } from '$stores/app'

  import type { PageData } from './$types'

  export let data: PageData

  beforeNavigate(async (navigation) => {
    await tick()
    if (
      navigation.to?.route.id?.startsWith(
        '/customers/[id=integer]/training-classifications/[secondId=integer]'
      )
    ) {
      breadcrumbSecondName.set(data.trainingClassification.typeLabel)
    }
  })

  onMount(() => {
    breadcrumbSecondName.set(data.trainingClassification.typeLabel)
  })
</script>

<slot />
