import gql from 'graphql-tag'

export const mutations = {
  createMasterSeminarDomain: gql`
    mutation (
      $createMasterSeminarDomainInput: CreateMasterSeminarDomainInput!
    ) {
      createMasterSeminarDomain(
        createMasterSeminarDomainInput: $createMasterSeminarDomainInput
      ) {
        id
        name
        lecturers {
          id
          firstName
          lastName
          businessName
        }
      }
    }
  `,
  updateMasterSeminarDomain: gql`
    mutation (
      $updateMasterSeminarDomainInput: UpdateMasterSeminarDomainInput!
    ) {
      updateMasterSeminarDomain(
        updateMasterSeminarDomainInput: $updateMasterSeminarDomainInput
      ) {
        id
        name
        lecturers {
          id
          firstName
          lastName
          businessName
        }
      }
    }
  `,
  deleteMasterSeminarDomain: gql`
    mutation ($id: Int!) {
      deleteMasterSeminarDomain(id: $id)
    }
  `
}
