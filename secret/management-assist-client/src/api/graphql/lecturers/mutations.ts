import gql from 'graphql-tag'

export const mutations = {
  createLecturer: gql`
    mutation ($createLecturerInput: CreateLecturerInput!) {
      createLecturer(createLecturerInput: $createLecturerInput) {
        id
        masterLecturerAffiliatedOrganizationId
        firstName
        lastName
        businessName
        firstNameKana
        lastNameKana
        bussinessNameKana
        imageUrl
        role
        sendDocumentAddressType
        archived
        isJoinedMailingList
        isAvailableReviewTeachingMaterial
        transportationExpenses
        privacyPolicyMemorandumConfirmedDate
        privacyPolicyAgreedDate
        postalCode
        prefectureCode
        city
        town
        addressLine
        teachingMaterialAchivementsNote
        attentionNote
        note
        masterLecturerAffiliatedOrganization {
          id
          name
        }
        lecturerContract {
          id
          lecturerId
          type
          contractorType
          startDate
          endDate
          note
          isEnded
        }
        lecturerDetails {
          id
          lecturerId
          current
          financialYear
        }
        lecturerContacts {
          id
          lecturerId
          type
          label
          value
        }
        lecturerEmergencyContacts {
          id
          lecturerId
          name
          relationship
          phoneNumber
        }
        masterLecturerCategories {
          id
          name
        }
        masterSeminarDomains {
          id
          name
        }
      }
    }
  `,
  updateLecturer: gql`
    mutation ($updateLecturerInput: UpdateLecturerInput!) {
      updateLecturer(updateLecturerInput: $updateLecturerInput) {
        id
        masterLecturerAffiliatedOrganizationId
        firstName
        lastName
        businessName
        firstNameKana
        lastNameKana
        bussinessNameKana
        imageUrl
        role
        sendDocumentAddressType
        archived
        isJoinedMailingList
        isAvailableReviewTeachingMaterial
        transportationExpenses
        privacyPolicyMemorandumConfirmedDate
        privacyPolicyAgreedDate
        postalCode
        prefectureCode
        city
        town
        addressLine
        teachingMaterialAchivementsNote
        attentionNote
        note
        masterLecturerAffiliatedOrganization {
          id
          name
        }
        lecturerContract {
          id
          lecturerId
          type
          contractorType
          startDate
          endDate
          note
          isEnded
        }
        lecturerDetails {
          id
          lecturerId
          current
          financialYear
        }
        lecturerContacts {
          id
          lecturerId
          type
          label
          value
        }
        lecturerEmergencyContacts {
          id
          lecturerId
          name
          relationship
          phoneNumber
        }
        masterLecturerCategories {
          id
          name
        }
        masterSeminarDomains {
          id
          name
        }
      }
    }
  `,
  deleteLecturer: gql`
    mutation ($id: Int!) {
      deleteLecturer(id: $id)
    }
  `
}
