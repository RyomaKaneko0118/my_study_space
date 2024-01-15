import gql from 'graphql-tag'

export const mutations = {
  createLecturerPin: gql`
    mutation ($lecturerId: Int!) {
      createLecturerPin(lecturerId: $lecturerId)
    }
  `,
  deleteLecturerPin: gql`
    mutation ($lecturerId: Int!) {
      deleteLecturerPin(lecturerId: $lecturerId)
    }
  `
}
