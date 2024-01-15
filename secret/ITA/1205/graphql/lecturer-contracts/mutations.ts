import gql from 'graphql-tag'

export const mutations = {
  createLecturerContract: gql`
    mutation ($createLecturerContractInput: CreateLecturerContractInput!) {
      createLecturerContract(
        createLecturerContractInput: $createLecturerContractInput
      ) {
        id
        lecturerId
        type
        contractorType
        startDate
        endDate
        note
      }
    }
  `,
  updateLecturerContract: gql`
    mutation ($updateLecturerContractInput: UpdateLecturerContractInput!) {
      updateLecturerContract(
        updateLecturerContractInput: $updateLecturerContractInput
      ) {
        id
        lecturerId
        type
        contractorType
        startDate
        endDate
        note
      }
    }
  `
}
