import gql from 'graphql-tag'

export const queries = {
  getLecturerFees: gql`
    query ($lecturerDetailId: Int!) {
      lecturerFees(lecturerDetailId: $lecturerDetailId) {
        id
        lecturerDetailId
        label
        fee
        note
      }
    }
  `
}
