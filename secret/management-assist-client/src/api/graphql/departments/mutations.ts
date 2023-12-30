import gql from 'graphql-tag'

export const mutations = {
  createDepartment: gql`
    mutation ($createDepartmentInput: CreateDepartmentInput!) {
      createDepartment(createDepartmentInput: $createDepartmentInput) {
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
    }
  `,
  updateDepartment: gql`
    mutation ($updateDepartmentInput: UpdateDepartmentInput!) {
      updateDepartment(updateDepartmentInput: $updateDepartmentInput) {
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
    }
  `,
  deleteDepartment: gql`
    mutation ($id: Int!) {
      deleteDepartment(id: $id)
    }
  `
}
