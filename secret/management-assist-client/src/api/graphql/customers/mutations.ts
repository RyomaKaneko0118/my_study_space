import gql from 'graphql-tag'

export const mutations = {
  createCustomer: gql`
    mutation ($createCustomerInput: CreateCustomerInput!) {
      createCustomer(createCustomerInput: $createCustomerInput) {
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
  `,
  updateCustomer: gql`
    mutation ($updateCustomerInput: UpdateCustomerInput!) {
      updateCustomer(updateCustomerInput: $updateCustomerInput) {
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
  `,
  deleteCustomer: gql`
    mutation ($id: Int!) {
      deleteCustomer(id: $id)
    }
  `
}
