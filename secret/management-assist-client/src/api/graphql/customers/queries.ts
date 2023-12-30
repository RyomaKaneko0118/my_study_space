import gql from 'graphql-tag'

export const queries = {
  getCustomers: gql`
    query (
      $page: Int
      $take: Int
      $name: String
      $coordinatorSaUserId: Int
      $pinnedOnly: Boolean
      $includeArchived: Boolean
      $field: CustomersField
      $direction: SortDirection
    ) {
      customers(
        page: $page
        take: $take
        name: $name
        coordinatorSaUserId: $coordinatorSaUserId
        pinnedOnly: $pinnedOnly
        includeArchived: $includeArchived
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
            boardClientId
            saCompanyId
            archived
            dealingStartDate
            dealingEndDate
            dealingPeriod
            logoUrl
            contractNote
            currentCustomerDetail {
              id
              customerId
              name
              nameDisp
              sales
              zip
              pref
              address1
              address2
              financialYear
              link
              parent
              affiliate
              note
              coordinators {
                id
                customerDetailId
                saUserId
                role
              }
            }
            customerPins {
              customerId
              saUserId
            }
          }
        }
      }
    }
  `,
  getCustomer: gql`
    query ($id: Int!) {
      customer(id: $id) {
        id
        boardClientId
        saCompanyId
        archived
        dealingStartDate
        dealingEndDate
        dealingPeriod
        logoUrl
        contractNote
        currentCustomerDetail {
          id
          customerId
          name
          nameDisp
          sales
          zip
          pref
          address1
          address2
          financialYear
          link
          parent
          affiliate
          note
          coordinators {
            id
            customerDetailId
            saUserId
            role
          }
        }
        customerDetails {
          id
          customerId
          name
          nameDisp
          sales
          zip
          pref
          address1
          address2
          financialYear
          link
          parent
          affiliate
          note
          coordinators {
            id
            customerDetailId
            saUserId
            role
          }
        }
        departments {
          id
          customerId
          prefectureCode
          name
          dealingStartDate
          dealingEndDate
          dealingPeriod
          note
          postalCode
          city
          town
          addressLine
        }
        managers {
          id
          customerId
          departmentId
          firstName
          lastName
          firstNameKana
          lastNameKana
          email
          startYear
          endYear
          post
          phoneNumber
          note
          trainingClassificationManagers {
            id
            trainingClassificationId
            managerId
            role
            trainingClassification {
              id
              customerDetailId
              type
            }
          }
        }
      }
    }
  `
}
