import gql from 'graphql-tag'

export const mutations = {
  createCustomerPin: gql`
    mutation ($customerId: Int!) {
      createCustomerPin(customerId: $customerId)
    }
  `,
  deleteCustomerPin: gql`
    mutation ($customerId: Int!) {
      deleteCustomerPin(customerId: $customerId)
    }
  `
}
