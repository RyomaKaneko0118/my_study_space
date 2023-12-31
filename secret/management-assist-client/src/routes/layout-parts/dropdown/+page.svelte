<script lang="ts">
  import {
    faAngleDown,
    faRightFromBracket,
    faUserCircle
  } from '@fortawesome/free-solid-svg-icons'
  import { slide } from 'svelte/transition'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import CommonDropdown from '$lib/components/CommonDropdown.svelte'
  import CommonDropdownItem from '$lib/components/CommonDropdownItem.svelte'

  let showMenu = false
  const signout = () => {
    console.log('signout')
  }

  const toggleMenu = () => {
    showMenu = !showMenu
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
  <div class="dropdown-wrapper">
    <div class="drop-down-wrapper">
      <button class="dropdown" on:click|stopPropagation={toggleMenu}>
        <Fa icon={faUserCircle} />
        <span class="mx-xs fw-bold">ドロップダウンリスト</span>
        <Fa icon={faAngleDown} />
      </button>
      {#if showMenu}
        <ul class="dropdown-menu" transition:slide>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <li
            class="d-flex align-items-center dropdown-item hoverable"
            on:click={signout}
          >
            <Fa icon={faRightFromBracket} />
            <span class="ml-xs">ログアウト</span>
          </li>
        </ul>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  .dropdown-wrapper {
    width: 200px;
  }

  .drop-down-wrapper {
    position: relative;
  }

  .dropdown-menu {
    z-index: 2;
    position: absolute;
    top: 100%;
    right: 0;
    white-space: nowrap;
    background-color: $color-white;
    border-radius: 5px;
    box-shadow: $box-shadow;

    &::after {
      content: '';
      position: absolute;
      display: block;
      height: 10px;
      width: 100%;
      background-color: transparent;
      pointer-events: none;
    }
  }

  .dropdown-item {
    cursor: pointer;
    padding: 10px 20px;
  }
</style>
