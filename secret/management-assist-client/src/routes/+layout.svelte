<script lang="ts">
  import '$styles/app.scss'
  import { PUBLIC_TITLE } from '$env/static/public'
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<!-- <TheNavigation
  {withSubNavigation}
  {withCustomerSubNavigation}
  {withLecturerSubNavigation}
/> -->

<!-- <main
  class:with-navigation={$authenticatedAdmin !== null}
  class:with-sub-navigation={withSubNavigation}
> -->
<main>
  <slot />
</main>

<!-- <TheServerErrorModal />
<TheLoading /> -->

<style lang="scss">
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;

    // &.with-navigation {
    //   margin: 90px 0 0 60px;

    //   @include mq(lg) {
    //     margin: 90px 0 0 240px;
    //   }

    //   &.with-sub-navigation {
    //     margin: 90px 0 0 180px;
    //   }
    // }
  }
</style>
