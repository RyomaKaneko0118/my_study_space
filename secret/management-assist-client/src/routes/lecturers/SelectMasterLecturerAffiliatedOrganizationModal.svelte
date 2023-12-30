<script lang="ts">
  import { faCheck } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'

  import { masterLecturerAffiliatedOrganizationsQueries } from '$api/graphql/master-lecturer-affiliated-organizations'

  import { serverError } from '$stores/app'

  import apolloClient from '$lib/apollo'
  import { MasterLecturerAffiliatedOrganization } from '$lib/models'
  import type { Edge, PageInfo } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonLoading from '$lib/components/CommonLoading.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonPagination from '$lib/components/CommonPagination.svelte'

  export let show = false
  export let selectedMasterLecturerAffiliatedOrganizationId: number | undefined

  $: if (show) {
    if (!fetched) fetchMasterLecturerAffiliatedOrganizations()
  }

  let fetched = false
  let loading = false
  let masterLecturerAffiliatedOrganizations: MasterLecturerAffiliatedOrganization[] =
    []
  let pageInfo: PageInfo | null = null

  const dispatchOnSelect = createEventDispatcher<{
    select?: MasterLecturerAffiliatedOrganization
  }>()

  const fetchMasterLecturerAffiliatedOrganizations = async (page = 1) => {
    fetched = true
    loading = true

    try {
      const result = await apolloClient.query({
        query:
          masterLecturerAffiliatedOrganizationsQueries.getMasterLecturerAffiliatedOrganizations,
        variables: {
          page
        },
        fetchPolicy: 'no-cache'
      })
      masterLecturerAffiliatedOrganizations =
        result.data.masterLecturerAffiliatedOrganizations.edges.map(
          (edge: Edge) => new MasterLecturerAffiliatedOrganization(edge.node)
        )
      pageInfo = result.data.masterLecturerAffiliatedOrganizations.pageInfo
    } catch {
      serverError.set(true)
    } finally {
      loading = false
    }
  }
</script>

<CommonModal {show} on:close>
  <div class="table-wrapper mb-md">
    {#if loading}
      <div class="loading-wrapper">
        <CommonLoading />
      </div>
    {:else}
      <table class="table sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>組織名</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each masterLecturerAffiliatedOrganizations as masterlectureraffiliatedorganization}
            <tr
              class="hoverable clickable"
              on:click={() => {
                dispatchOnSelect(
                  'select',
                  selectedMasterLecturerAffiliatedOrganizationId ===
                    masterlectureraffiliatedorganization.id
                    ? undefined
                    : masterlectureraffiliatedorganization
                )
              }}
            >
              <th>{masterlectureraffiliatedorganization.id}</th>
              <td>{masterlectureraffiliatedorganization.name}</td>
              <td class="text-secondary">
                {#if selectedMasterLecturerAffiliatedOrganizationId === masterlectureraffiliatedorganization.id}
                  <Fa icon={faCheck} />
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  {#if !loading && pageInfo}
    <CommonPagination
      {pageInfo}
      on:clickPage={(e) => fetchMasterLecturerAffiliatedOrganizations(e.detail)}
    />
  {/if}
  <div slot="footer">
    <div class="default-btn-fit-wrapper">
      <CommonButton on:click={() => dispatchOnSelect('select')}
        >所属組織なし</CommonButton
      >
    </div>
  </div>
</CommonModal>

<style lang="scss">
  .table-wrapper {
    max-height: 400px;
    background-color: $color-white;
  }

  .loading-wrapper {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
