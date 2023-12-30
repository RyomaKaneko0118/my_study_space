import gql from 'graphql-tag'

export const mutations = {
  createContract: gql`
    mutation ($createContractInput: CreateContractInput!) {
      createContract(createContractInput: $createContractInput) {
        id
      }
    }
  `,
  updateContract: gql`
    mutation ($updateContractInput: UpdateContractInput!) {
      updateContract(updateContractInput: $updateContractInput) {
        id
      }
    }
  `,
  deleteContract: gql`
    mutation ($id: Int!) {
      deleteContract(id: $id)
    }
  `
}
