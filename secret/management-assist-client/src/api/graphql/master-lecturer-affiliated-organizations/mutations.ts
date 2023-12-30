import gql from 'graphql-tag'

export const mutations = {
  createMasterLecturerAffiliatedOrganization: gql`
    mutation (
      $createMasterLecturerAffiliatedOrganizationInput: CreateMasterLecturerAffiliatedOrganizationInput!
    ) {
      createMasterLecturerAffiliatedOrganization(
        createMasterLecturerAffiliatedOrganizationInput: $createMasterLecturerAffiliatedOrganizationInput
      ) {
        id
        name
        representativeName
        representativePost
        invoiceNumber
        corporateNumber
        equityStock
        prefectureCode
        link
        phoneNumber
        postalCode
        city
        town
        addressLine
        lecturers {
          id
          firstName
          lastName
          businessName
        }
      }
    }
  `,
  updateMasterLecturerAffiliatedOrganization: gql`
    mutation (
      $updateMasterLecturerAffiliatedOrganizationInput: UpdateMasterLecturerAffiliatedOrganizationInput!
    ) {
      updateMasterLecturerAffiliatedOrganization(
        updateMasterLecturerAffiliatedOrganizationInput: $updateMasterLecturerAffiliatedOrganizationInput
      ) {
        id
        name
        representativeName
        representativePost
        invoiceNumber
        corporateNumber
        equityStock
        prefectureCode
        link
        phoneNumber
        postalCode
        city
        town
        addressLine
        lecturers {
          id
          firstName
          lastName
          businessName
        }
      }
    }
  `,
  deleteMasterLecturerAffiliatedOrganization: gql`
    mutation ($id: Int!) {
      deleteMasterLecturerAffiliatedOrganization(id: $id)
    }
  `
}
