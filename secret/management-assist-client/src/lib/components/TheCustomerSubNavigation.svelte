<script lang="ts">
  import { page } from '$app/stores'
</script>

<aside>
  <nav class="flex-1">
    <ul>
      <li
        class:active={$page.route.id === '/customers/[id=integer]' ||
          $page.route.id === '/customers/[id=integer]/edit'}
      >
        <a href="/customers/{$page.params.id}" class="menu">基本情報</a>
      </li>
      <li
        class:active={$page.route.id?.startsWith(
          '/customers/[id=integer]/departments'
        )}
      >
        <a href="/customers/{$page.params.id}/departments" class="menu">部門</a>
      </li>
      <li
        class:active={$page.route.id?.startsWith(
          '/customers/[id=integer]/managers'
        )}
      >
        <a href="/customers/{$page.params.id}/managers" class="menu">担当者</a>
      </li>
      <li
        class:active={$page.route.id?.startsWith(
          '/customers/[id=integer]/training-classifications'
        )}
      >
        <a
          href="/customers/{$page.params.id}/training-classifications"
          class="menu">研修分類</a
        >
      </li>
      <li
        class:active={$page.route.id?.startsWith(
          '/customers/[id=integer]/contracts'
        )}
      >
        <a href="/customers/{$page.params.id}/contracts" class="menu">契約</a>
      </li>
    </ul>
  </nav>
</aside>

<style lang="scss">
  aside {
    position: fixed;
    top: 0;
    left: 60px;
    width: 120px;
    height: 100vh;
    padding-top: 50px;
    font-size: $font-size-sm;
    background-color: $color-white;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    z-index: 1;

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
          }
        }
      }
    }
  }
</style>
