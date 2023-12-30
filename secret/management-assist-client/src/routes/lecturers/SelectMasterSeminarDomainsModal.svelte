<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { masterSeminarDomainsQueries } from '$api/graphql/master-seminar-domains'

  import { serverError } from '$stores/app'

  import apolloClient from '$lib/apollo'
  import { MasterSeminarDomain } from '$lib/models'
  import type { Edge, PageInfo } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'
  import CommonLoading from '$lib/components/CommonLoading.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonPagination from '$lib/components/CommonPagination.svelte'

  export let show = false
  export let selectedMasterSeminarDomains: MasterSeminarDomain[]

  $: if (show) {
    if (!fetched) fetchMasterSeminarDomains()
    editMasterSeminarDomains = selectedMasterSeminarDomains
  } else {
    editMasterSeminarDomains = []
  }

  let fetched = false
  let loading = false
  let editMasterSeminarDomains: MasterSeminarDomain[]
  let masterSeminarDomains: MasterSeminarDomain[] = []
  let pageInfo: PageInfo | null = null

  const dispatch = createEventDispatcher()
  const dispatchOnSelect = createEventDispatcher<{
    select: MasterSeminarDomain[]
  }>()

  const onChange = (masterSeminarDomain: MasterSeminarDomain) => {
    if (
      editMasterSeminarDomains.some(
        (editMasterSeminarDomain) =>
          editMasterSeminarDomain.id === masterSeminarDomain.id
      )
    ) {
      editMasterSeminarDomains = editMasterSeminarDomains.filter(
        (editMasterSeminarDomain) =>
          editMasterSeminarDomain.id !== masterSeminarDomain.id
      )
    } else {
      editMasterSeminarDomains = [
        ...editMasterSeminarDomains,
        masterSeminarDomain
      ]
    }
  }

  const fetchMasterSeminarDomains = async (page = 1) => {
    fetched = true
    loading = true

    try {
      const result = await apolloClient.query({
        query: masterSeminarDomainsQueries.getMasterSeminarDomains,
        variables: {
          page
        },
        fetchPolicy: 'no-cache'
      })
      masterSeminarDomains = result.data.masterSeminarDomains.edges.map(
        (edge: Edge) => new MasterSeminarDomain(edge.node)
      )
      pageInfo = result.data.masterSeminarDomains.pageInfo
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
            <th />
            <th>研修分野名</th>
          </tr>
        </thead>
        <tbody>
          {#each masterSeminarDomains as masterSeminarDomain}
            <tr>
              <th class="check-column">
                <CommonCheckbox
                  checked={editMasterSeminarDomains.some(
                    (editMasterSeminarDomain) =>
                      editMasterSeminarDomain.id === masterSeminarDomain.id
                  )}
                  on:change={() => onChange(masterSeminarDomain)}
                />
              </th>
              <td>{masterSeminarDomain.name}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  {#if !loading && pageInfo}
    <CommonPagination
      {pageInfo}
      on:clickPage={(e) => fetchMasterSeminarDomains(e.detail)}
    />
  {/if}
  <div slot="footer" class="d-flex">
    <div class="default-btn-fit-wrapper mr-sm">
      <CommonButton outline on:click={() => dispatch('close')}
        >キャンセル</CommonButton
      >
    </div>
    <div class="default-btn-fit-wrapper">
      <CommonButton
        variant="secondary"
        on:click={() => dispatchOnSelect('select', editMasterSeminarDomains)}
        >OK</CommonButton
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

  .check-column {
    width: 80px;
  }
</style>
