import gql from 'graphql-tag'

export const queries = {
  getLecturers: gql`
    query (
      $page: Int
      $take: Int
      $name: String
      $masterLecturerCategoryId: Int
      $pinnedOnly: Boolean
      $includeArchived: Boolean
      $field: LecturersField
      $direction: SortDirection
    ) {
      lecturers(
        page: $page
        take: $take
        name: $name
        masterLecturerCategoryId: $masterLecturerCategoryId
        pinnedOnly: $pinnedOnly
        includeArchived: $includeArchived
        field: $field
        direction: $direction
      ) {
        pageInfo {
          currentPage
          take
          totalCount
          hasNextPage
          hasPrevPage
        }
        edges {
          node {
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
            lecturerPins {
              lecturerId
              saUserId
            }
            masterLecturerCategories {
              id
              name
            }
          }
        }
      }
    }
  `,
  getLecturer: gql`
    query ($id: Int!) {
      lecturer(id: $id) {
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
  `
}
