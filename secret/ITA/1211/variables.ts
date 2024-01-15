import type {
  CreateLecturerContactInput,
  UpdateLecturerContactInput
} from '$api/graphql/lecturer-contacts'
import type {
  CreateLecturerEmergencyContactInput,
  UpdateLecturerEmergencyContactInput
} from '$api/graphql/lecturer-emergency-contacts'

import type { LecturerRole, LecturerSendDocumentAddressType } from '$lib/models'

export type CreateLecturerInput = {
  masterLecturerAffiliatedOrganizationId?: number
  firstName: string
  lastName: string
  businessName: string
  firstNameKana: string
  lastNameKana: string
  bussinessNameKana: string
  image?: File | null
  role: LecturerRole
  sendDocumentAddressType: LecturerSendDocumentAddressType
  isJoinedMailingList: boolean
  isAvailableReviewTeachingMaterial: boolean
  transportationExpenses?: number
  privacyPolicyMemorandumConfirmedDate?: Date
  privacyPolicyAgreedDate?: Date
  postalCode?: string
  prefectureCode?: number
  city?: string
  town?: string
  addressLine?: string
  teachingMaterialAchivementsNote: string
  attentionNote: string
  note: string
  createLecturerContactInputs?: CreateLecturerContactInput[]
  createLecturerEmergencyContactInputs?: CreateLecturerEmergencyContactInput[]
  connectMasterLecturerCategoryIds?: number[]
  connectMasterSeminarDomainIds?: number[]
}

export type UpdateLecturerInput = {
  id: number
  archived?: boolean
  masterLecturerAffiliatedOrganizationId?: number | null
  firstName?: string
  lastName?: string
  businessName?: string
  firstNameKana?: string
  lastNameKana?: string
  bussinessNameKana?: string
  image?: File | null
  role?: LecturerRole
  sendDocumentAddressType?: LecturerSendDocumentAddressType
  isJoinedMailingList?: boolean
  isAvailableReviewTeachingMaterial?: boolean
  transportationExpenses?: number | null
  privacyPolicyMemorandumConfirmedDate?: Date | null
  privacyPolicyAgreedDate?: Date | null
  postalCode?: string
  prefectureCode?: number | null
  city?: string
  town?: string
  addressLine?: string
  teachingMaterialAchivementsNote?: string
  attentionNote?: string
  note?: string
  createLecturerContactInputs?: CreateLecturerContactInput[]
  createLecturerEmergencyContactInputs?: CreateLecturerEmergencyContactInput[]
  updateLecturerContactInputs?: UpdateLecturerContactInput[]
  updateLecturerEmergencyContactInputs?: UpdateLecturerEmergencyContactInput[]
  deleteLecturerContactIds?: number[]
  deleteLecturerEmergencyContactIds?: number[]
  connectMasterLecturerCategoryIds?: number[]
  disconnectMasterLecturerCategoryIds?: number[]
  connectMasterSeminarDomainIds?: number[]
  disconnectMasterSeminarDomainIds?: number[]
}
