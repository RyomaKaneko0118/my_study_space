import gql from 'graphql-tag'

export const queries = {
  getMasterLecturerAffiliatedOrganizations: gql`
    query (
      $page: Int
      $take: Int
      $name: String
      $field: MasterLecturerAffiliatedOrganizationsField
      $direction: SortDirection
    ) {
      masterLecturerAffiliatedOrganizations(
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
            representativeName
            representativePost
            invoiceNumber
            corporateNumber
            equityStock
            prefectureCode
            link
            phoneNumber
            postalCode
            city
            town
            addressLine
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
  getMasterLecturerAffiliatedOrganization: gql`
    query ($id: Int!) {
      masterLecturerAffiliatedOrganization(id: $id) {
        id
        name
        representativeName
        representativePost
        invoiceNumber
        corporateNumber
        equityStock
        prefectureCode
        link
        phoneNumber
        postalCode
        city
        town
        addressLine
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
