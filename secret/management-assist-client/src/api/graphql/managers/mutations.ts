import gql from 'graphql-tag'

export const mutations = {
  createManager: gql`
    mutation ($createManagerInput: CreateManagerInput!) {
      createManager(createManagerInput: $createManagerInput) {
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
  `,
  updateManager: gql`
    mutation ($updateManagerInput: UpdateManagerInput!) {
      updateManager(updateManagerInput: $updateManagerInput) {
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
  `,
  deleteManager: gql`
    mutation ($id: Int!) {
      deleteManager(id: $id)
    }
  `
}
