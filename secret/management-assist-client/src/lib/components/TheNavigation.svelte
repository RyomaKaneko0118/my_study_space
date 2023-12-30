<script lang="ts">
  import {
    faAngleUp,
    faAngleDown,
    faBars,
    faBuilding,
    faChalkboardUser,
    faCoins,
    faLayerGroup,
    faRightFromBracket,
    faUserCircle,
    faUserGroup,
    faUser
  } from '@fortawesome/free-solid-svg-icons'
  import Cookies from 'js-cookie'
  import { slide } from 'svelte/transition'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { goto } from '$app/navigation'
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'

  import imgLogo from '$assets/images/logo.png'

  import { breadcrumbName, breadcrumbSecondName } from '$stores/app'
  import { authenticatedAdmin } from '$stores/auth'

  import { setBreadcrumbs } from '$lib/breadcrumb'

  import CommonDropdown from '$lib/components/CommonDropdown.svelte'
  import CommonDropdownItem from '$lib/components/CommonDropdownItem.svelte'
  import TheCustomerSubNavigation from '$lib/components/TheCustomerSubNavigation.svelte'
  import TheLecturerSubNavigation from '$lib/components/TheLecturerSubNavigation.svelte'

  export let withSubNavigation: boolean
  export let withCustomerSubNavigation: boolean
  export let withLecturerSubNavigation: boolean

  $: breadcrumbs = setBreadcrumbs($page, $breadcrumbName, $breadcrumbSecondName)

  const closeAllMenus = () => {
    showLecturerMenus = false
    showSeminarMenus = false
  }

  const toggleLecturerMenus = () => {
    if (!showLecturerMenus) closeAllMenus()
    showLecturerMenus = !showLecturerMenus
  }

  const toggleSeminarMenus = () => {
    if (!showSeminarMenus) closeAllMenus()
    showSeminarMenus = !showSeminarMenus
  }

  const signout = () => {
    Cookies.remove('management-assist-session')
    authenticatedAdmin.set(null)
    goto('/auth/signin')
  }

  let showLecturerMenus = false
  let showSeminarMenus = false

  beforeNavigate((navigation) => {
    const isLecturerMenu =
      navigation.to?.route.id?.startsWith('/lecturers') ||
      navigation.to?.route.id?.startsWith(
        '/master-lecturer-affiliated-organizations'
      ) ||
      navigation.to?.route.id === '/lecturer-fees'

    const isSeminarMenu =
      navigation.to?.route.id?.startsWith('/seminars') ||
      navigation.to?.route.id?.startsWith('/master-seminar-domains')

    if (isLecturerMenu) {
      if (!showLecturerMenus) toggleLecturerMenus()
    } else if (isSeminarMenu) {
      if (!showSeminarMenus) toggleSeminarMenus()
    } else {
      closeAllMenus()
    }
  })
</script>

{#if $authenticatedAdmin}
  <header>
    <a href="/">
      <img src={imgLogo} alt="logo" class="logo" />
    </a>
    <CommonDropdown>
      <svelte:fragment slot="toggle">
        <Fa icon={faUserCircle} />
        <span class="mx-xs fw-bold">{$authenticatedAdmin.displayName}</span>
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
      </svelte:fragment>
    </CommonDropdown>
  </header>
  <aside class:with-sub-navigation={withSubNavigation}>
    <nav class="flex-1">
      <ul>
        <li class:active={$page.route.id === '/'}>
          <a href="/" class="menu">
            <div class="icon-wrapper">
              <Fa icon={faBars} />
            </div>
            <span>ダッシュボード</span>
          </a>
        </li>
        <li class:active={$page.route.id?.startsWith('/customers')}>
          <a href="/customers" class="menu">
            <div class="icon-wrapper">
              <Fa icon={faBuilding} />
            </div>
            <span>顧客管理</span>
          </a>
        </li>
        <li>
          <button
            class="menu lg:justify-content-space-between"
            on:click={toggleLecturerMenus}
          >
            <div class="d-flex align-items-center">
              <div class="icon-wrapper">
                <Fa icon={faUser} />
              </div>
              <span>講師管理</span>
            </div>
            <Fa icon={showLecturerMenus ? faAngleUp : faAngleDown} />
          </button>
        </li>
        {#if showLecturerMenus}
          <li
            transition:slide
            class:active={$page.route.id?.startsWith('/lecturers')}
          >
            <a href="/lecturers" class="menu sub">
              <div class="icon-wrapper">
                <Fa icon={faUser} />
              </div>
              <span>講師</span>
            </a>
          </li>
          <li
            transition:slide
            class:active={$page.route.id?.startsWith(
              '/master-lecturer-affiliated-organizations'
            )}
          >
            <a
              href="/master-lecturer-affiliated-organizations"
              class="menu sub"
            >
              <div class="icon-wrapper">
                <Fa icon={faUserGroup} />
              </div>
              <span>所属組織</span>
            </a>
          </li>
          <li
            transition:slide
            class:active={$page.route.id === '/lecturer-fees'}
          >
            <a href="/lecturer-fees" class="menu sub">
              <div class="icon-wrapper">
                <Fa icon={faCoins} />
              </div>
              <span>講師料</span>
            </a>
          </li>
        {/if}
        <li>
          <button
            class="menu lg:justify-content-space-between"
            on:click={toggleSeminarMenus}
          >
            <div class="d-flex align-items-center">
              <div class="icon-wrapper">
                <Fa icon={faChalkboardUser} />
              </div>
              <span>研修管理</span>
            </div>
            <Fa icon={showSeminarMenus ? faAngleUp : faAngleDown} />
          </button>
        </li>
        {#if showSeminarMenus}
          <li
            transition:slide
            class:active={$page.route.id?.startsWith('/seminars')}
          >
            <a href="/seminars" class="menu sub">
              <div class="icon-wrapper">
                <Fa icon={faChalkboardUser} />
              </div>
              <span>研修</span>
            </a>
          </li>
          <li
            transition:slide
            class:active={$page.route.id?.startsWith('/master-seminar-domains')}
          >
            <a href="/master-seminar-domains" class="menu sub">
              <div class="icon-wrapper">
                <Fa icon={faLayerGroup} />
              </div>
              <span>研修分野</span>
            </a>
          </li>
        {/if}
      </ul>
    </nav>
  </aside>
  {#if withCustomerSubNavigation}
    <TheCustomerSubNavigation />
  {/if}
  {#if withLecturerSubNavigation}
    <TheLecturerSubNavigation />
  {/if}
  {#if $page.status === 200}
    <div class="breadcrumb" class:with-sub-navigation={withSubNavigation}>
      {#each breadcrumbs as breadcrumb, i}
        <div>
          {#if !breadcrumb.current}
            <a href={breadcrumb.link}>{breadcrumb.name}</a>
          {:else}
            <span class="fw-bold text-primary">{breadcrumb.name}</span>
          {/if}
          {#if breadcrumbs.length !== i + 1}
            <span class="separator" />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
{/if}

<style lang="scss">
  header {
    position: fixed;
    z-index: 3;
    width: 100vw;
    height: 50px;
    padding: 0 30px;
    background-color: $color-white;
    border-bottom: 1px solid $color-border;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $font-size-sm;

    .logo {
      display: block;
      height: 20px;
    }
  }

  aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 60px;
    height: 100vh;
    padding: 50px 0 10px 0;
    background-color: $color-white;
    box-shadow: $box-shadow;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
    overflow: auto;
    transition: all 0.3s;

    @include mq(lg) {
      width: 240px;
    }

    &.with-sub-navigation {
      width: 60px;

      nav ul li {
        .menu {
          padding: 0 10px;
          justify-content: center !important;

          &.sub {
            padding: 0 10px;
          }
        }
        span {
          display: none !important;
        }
      }
    }

    nav {
      width: 100%;

      ul {
        list-style: none;

        li {
          position: relative;

          &.active {
            font-weight: $font-weight-bold;
            color: $color-primary;
            background-color: $color-background;

            &::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 4px;
              height: 100%;
              background-color: $color-primary;
            }
          }

          .menu {
            width: 100%;
            height: 40px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;

            @include mq(lg) {
              justify-content: flex-start;
              padding: 0 15px 0 30px;

              &.sub {
                padding: 0 30px 0 50px;
              }
            }

            .icon-wrapper {
              width: 20px;
              display: flex;
              justify-content: flex-start;
              flex-shrink: 0;
            }

            span {
              margin: 0 10px;
              display: none;

              @include mq(lg) {
                display: block;
              }
            }
          }
        }
      }
    }
  }

  .breadcrumb {
    position: fixed;
    top: 50px;
    left: 60px;
    width: calc(100% - 60px);
    height: 40px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    background-color: $color-white;
    color: $color-gray;
    font-size: $font-size-sm;
    box-shadow: $box-shadow;
    white-space: nowrap;
    overflow: auto;
    transition: all 0.3s;

    @include mq(lg) {
      left: 240px;
      width: calc(100% - 240px);
    }

    &.with-sub-navigation {
      left: 180px;
      width: calc(100% - 180px);
    }

    .separator {
      position: relative;
      display: inline-block;
      margin: 0 15px;

      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-top: solid 1px $color-border;
        border-right: solid 1px $color-border;
        position: absolute;
        left: -4px;
        top: -8px;
        transform: rotate(45deg);
      }
    }
  }
</style>
