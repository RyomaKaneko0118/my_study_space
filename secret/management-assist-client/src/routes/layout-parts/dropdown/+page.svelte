<script lang="ts">
  import {
    faAngleDown,
    faRightFromBracket,
    faUserCircle
  } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonDropdown from '$lib/components/CommonDropdown.svelte'
  import CommonDropdownItem from '$lib/components/CommonDropdownItem.svelte'

  const signout = () => {
    console.log('signout')
  }
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>ドロップダウン</h1>
  <CommonDropdown>
    <svelte:fragment slot="toggle">
      <Fa icon={faUserCircle} />
      <span class="mx-xs fw-bold">ドロップダウンリスト</span>
      <Fa icon={faAngleDown} />
    </svelte:fragment>
    <svelte:fragment slot="menu-items">
      <CommonDropdownItem class="d-flex align-items-center" on:click={signout}>
        <Fa icon={faRightFromBracket} />
        <span class="ml-xs">ログアウト</span>
      </CommonDropdownItem>
      <CommonDropdownItem class="d-flex align-items-center" on:click={signout}>
        <Fa icon={faRightFromBracket} />
        <span class="ml-xs">ログアウト</span>
      </CommonDropdownItem>
    </svelte:fragment>
  </CommonDropdown>
  <div class="dropdown-wrapper">
    <CommonDropdown>
      <svelte:fragment slot="toggle">
        <Fa icon={faUserCircle} />
        <span class="mx-xs fw-bold">ドロップダウンリスト</span>
        <Fa icon={faAngleDown} />
      </svelte:fragment>
      <svelte:fragment slot="menu-items">
        <CommonDropdownItem
          class="d-flex align-items-center"
          on:click={signout}
        >
          <Fa icon={faRightFromBracket} />
          <span class="ml-xs">ログアウト</span>
        </CommonDropdownItem>
        <CommonDropdownItem
          class="d-flex align-items-center"
          on:click={signout}
        >
          <Fa icon={faRightFromBracket} />
          <span class="ml-xs">ログアウト</span>
        </CommonDropdownItem>
      </svelte:fragment>
    </CommonDropdown>
  </div>
</section>

<style lang="scss">
  .dropdown-wrapper {
    width: 200px;
  }
</style>
