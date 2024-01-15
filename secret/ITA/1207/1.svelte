<script lang="ts">
  import {
    faUser,
    faPlus,
    faSortDown,
    faSortUp,
    faSort,
    faThumbTack
  } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import { lecturerPinsMutations } from '$api/graphql/lecturer-pins'
  import { lecturersQueries } from '$api/graphql/lecturers'

  import SearchForm from '$routes/lecturers/SearchForm.svelte'

  import { loading, serverError } from '$stores/app'
  import { authenticatedAdmin } from '$stores/auth'
  import { lecturers, pageInfo, filterAndSortArgs } from '$stores/lecturers'

  import apolloClient from '$lib/apollo'
  import { Lecturer, type Edge } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonPagination from '$lib/components/CommonPagination.svelte'

  let notHoverable = false

  const onClickPin = async (lecturer: Lecturer) => {
    loading.set(true)
    try {
      await apolloClient.mutate({
        mutation: lecturer.pinned
          ? lecturerPinsMutations.deleteLecturerPin
          : lecturerPinsMutations.createLecturerPin,
        variables: {
          lecturerId: lecturer.id
        }
      })
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }

    lecturers.set(
      $lecturers.map((storedLecturer) => {
        if (storedLecturer.id === lecturer.id) {
          if (storedLecturer.pinned) {
            storedLecturer.lecturerPins = []
          } else {
            storedLecturer.lecturerPins = [
              {
                saUserId: $authenticatedAdmin?.saUserId as number,
                lecturerId: storedLecturer.id
              }
            ]
          }
        }
        return storedLecturer
      })
    )
  }

  const onClickSort = (field: 'ID') => {
    $filterAndSortArgs = {
      ...$filterAndSortArgs,
      field,
      direction:
        $filterAndSortArgs.field !== field ||
        $filterAndSortArgs.direction !== 'ASC'
          ? 'ASC'
          : 'DESC'
    }
    fetchLecturers(1, true)
  }

  const onClickPage = (page: number) => {
    fetchLecturers(page)
  }

  const fetchLecturers = async (page = 1, forceLoading = false) => {
    if (forceLoading || $pageInfo?.currentPage !== page) {
      loading.set(true)
    }

    try {
      const result = await apolloClient.query({
        query: lecturersQueries.getLecturers,
        variables: {
          page,
          ...$filterAndSortArgs
        },
        fetchPolicy: 'no-cache'
      })
      lecturers.set(
        result.data.lecturers.edges.map((edge: Edge) => new Lecturer(edge.node))
      )
      pageInfo.set(result.data.lecturers.pageInfo)
    } catch {
      serverError.set(true)
    } finally {
      loading.set(false)
    }
  }

  onMount(() => {
    fetchLecturers($pageInfo?.currentPage)
  })
</script>

<svelte:head>
  <title>講師 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faUser} />
      <span class="ml-sm">講師</span>
    </h1>
    <div>
      <CommonButton
        variant="primary"
        size="sm"
        on:click={() => goto('/lecturers/new')}
      >
        <Fa icon={faPlus} />
        <span class="ml-xs">登録</span>
      </CommonButton>
    </div>
  </div>
  <div class="card p-md mt-md">
    <SearchForm on:search={() => fetchLecturers(1, true)} />
  </div>
  <div class="table-wrapper my-md">
    <table class="table">
      <thead>
        <tr>
          <th class="clickable" on:click={() => onClickSort('ID')}>
            <span>ID</span>
            <span
              class="sort-icon-wrapper"
              class:active={$filterAndSortArgs.field === 'ID'}
            >
              {#if $filterAndSortArgs.field === 'ID'}
                <Fa
                  icon={$filterAndSortArgs.direction === 'ASC'
                    ? faSortUp
                    : faSortDown}
                />
              {:else}
                <Fa icon={faSort} />
              {/if}
            </span>
          </th>
          <th>氏名</th>
          <th>ビジネスネーム</th>
          <th>担当領域</th>
          <th>契約開始日</th>
          <th>契約終了日</th>
          <th>契約状態</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each $lecturers as lecturer}
          <tr
            class="clickable"
            class:hoverable={!notHoverable}
            on:click={() => goto(`/lecturers/${lecturer.id}`)}
          >
            <th>{lecturer.id}</th>
            <td>{lecturer.fullName}</td>
            <td>{lecturer.businessName}</td>
            <td>
              <div class="default-badges-wrapper py-sm">
                {#each lecturer.masterLecturerCategories as masterLecturerCategory}
                  <span class="badge">{masterLecturerCategory.name}</span>
                {/each}
              </div>
            </td>
            <td>
              {#if lecturer.lecturerContract}
                {dayjs(lecturer.lecturerContract.startDate).format(
                  'YYYY年MM月DD日'
                )}
              {/if}
            </td>
            <td>
              {#if lecturer.lecturerContract?.endDate}
                {dayjs(lecturer.lecturerContract.endDate).format(
                  'YYYY年MM月DD日'
                )}
              {/if}
            </td>
            <td>
              <div class="default-badges-wrapper py-sm">
                {#if !lecturer.lecturerContract}
                  <span class="badge warning">未契約</span>
                {:else}
                  <span
                    class="badge {lecturer.lecturerContract.isEnded
                      ? 'danger'
                      : 'secondary'}"
                    >{lecturer.lecturerContract.statusLabel}</span
                  >
                {/if}
              </div>
            </td>
            <td>
              <div class="default-badges-wrapper py-sm">
                <!-- TODO: 契約状態 -->
                {#if lecturer.archived}
                  <span class="badge warning">アーカイブ済み</span>
                {/if}
              </div>
            </td>
            <td on:click|stopPropagation>
              <button
                class="pin-button hoverable"
                class:pinned={lecturer.pinned}
                on:pointerover={() => (notHoverable = true)}
                on:pointerleave={() => (notHoverable = false)}
                on:click={() => onClickPin(lecturer)}
              >
                <Fa icon={faThumbTack} size="lg" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <CommonPagination
    pageInfo={$pageInfo}
    on:clickPage={(e) => onClickPage(e.detail)}
  />
</section>

<style lang="scss">
  .pin-button {
    padding: 10px;
    color: $color-gray;
    transform: rotate(45deg);
    opacity: 0.5;
    transition: all 0.3s;

    &.pinned {
      color: $color-tertiary;
      opacity: 1;
    }
  }
</style>
