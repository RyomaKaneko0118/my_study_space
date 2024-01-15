import gql from 'graphql-tag'

export const queries = {
  getClients: gql`
    query {
      clients {
        id
        customerId
        name
        nameDisp
        zip
        pref
        address1
        address2
      }
    }
  `
}
