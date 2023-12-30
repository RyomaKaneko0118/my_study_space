import gql from 'graphql-tag'

export const queries = {
  getManagers: gql`
    query ($customerId: Int!) {
      managers(customerId: $customerId) {
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
  `
}
