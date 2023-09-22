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
        role
        phoneNumber
        note
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
        role
        phoneNumber
        note
      }
    }
  `,
  deleteManager: gql`
    mutation ($id: Int!) {
      deleteManager(id: $id)
    }
  `
}
