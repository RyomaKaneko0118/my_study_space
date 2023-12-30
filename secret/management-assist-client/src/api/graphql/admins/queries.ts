import gql from 'graphql-tag'

export const queries = {
  getAuthenticatedAdmin: gql`
    query {
      authenticatedAdmin {
        saUserId
        firstName
        lastName
        businnessName
      }
    }
  `,
  getAdmins: gql`
    query {
      admins {
        saUserId
        firstName
        lastName
        businnessName
      }
    }
  `
}
