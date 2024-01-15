import gql from 'graphql-tag'

export const queries = {
  getMasterSeminarDomains: gql`
    query (
      $page: Int
      $take: Int
      $name: String
      $field: MasterSeminarDomainsField
      $direction: SortDirection
    ) {
      masterSeminarDomains(
        page: $page
        take: $take
        name: $name
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
            name
            lecturers {
              id
              firstName
              lastName
              businessName
            }
          }
        }
      }
    }
  `,
  getMasterSeminarDomain: gql`
    query ($id: Int!) {
      masterSeminarDomain(id: $id) {
        id
        name
        lecturers {
          id
          firstName
          lastName
          businessName
        }
      }
    }
  `
}
