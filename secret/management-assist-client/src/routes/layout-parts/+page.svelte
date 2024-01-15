<script lang="ts">
  import { faBars } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'
</script>

<svelte:head>
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1>パーツリンク</h1>
  <nav>
    <ul>
      <li>
        <a href="/layout-parts/button" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>ボタン</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/radio-button" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>ラジオボタン</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/checkbox" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>チェックボックス</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/dropdown" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>ドロップダウン</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/input" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>インプット</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/select" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>セレクト</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/textarea" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>テキストエリア</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/tab" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>タブ</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/loading" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>ローディング</span>
        </a>
      </li>
      <li>
        <a href="/layout-parts/modal" class="menu">
          <div class="icon-wrapper">
            <Fa icon={faBars} />
          </div>
          <span>モーダル</span>
        </a>
      </li>
    </ul>
  </nav>
</section>

<style lang="scss">
  nav {
    width: 100%;

    ul {
      list-style: none;

      li {
        position: relative;

        // TODO
        // テクニック
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
</style>
