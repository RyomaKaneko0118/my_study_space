import gql from 'graphql-tag'

export const queries = {
  getContracts: gql`
    query (
      $page: Int
      $take: Int
      $customerId: Int!
      $includeOrigin: Boolean
      $field: ContractsField
      $direction: SortDirection
    ) {
      contracts(
        page: $page
        take: $take
        customerId: $customerId
        includeOrigin: $includeOrigin
        field: $field
        direction: $direction
      ) {
        pageInfo {
          currentPage
          take
          totalCount
          hasNextPage
          hasPrevPage
        }
        edges {
          node {
            id
            customerId
            departmentId
            contractId
            name
            type
            status
            startDate
            endDate
            autoUpdateCountOfMonths
            fileName
          }
        }
      }
    }
  `,
  getContract: gql`
    query ($id: Int!) {
      contract(id: $id) {
        id
        customerId
        departmentId
        contractId
        name
        type
        status
        startDate
        endDate
        autoUpdateCountOfMonths
        fileName
        originContract {
          id
          customerId
          departmentId
          contractId
          name
          type
          status
          startDate
          endDate
          autoUpdateCountOfMonths
          fileName
        }
        updatedContract {
          id
          customerId
          departmentId
          contractId
          name
          type
          status
          startDate
          endDate
          autoUpdateCountOfMonths
          fileName
        }
      }
    }
  `
}
