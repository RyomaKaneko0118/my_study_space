import gql from 'graphql-tag'

export const mutations = {
  updateLecturerFees: gql`
    mutation ($updateLecturerFeesInput: UpdateLecturerFeesInput!) {
      updateLecturerFees(updateLecturerFeesInput: $updateLecturerFeesInput) {
        id
        lecturerDetailId
        label
        fee
        note
      }
    }
  `
}
