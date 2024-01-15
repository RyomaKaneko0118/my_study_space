import {
  MasterLecturerAffiliatedOrganization,
  MasterLecturerCategory,
  MasterSeminarDomain,
  LecturerContact,
  convertPrefectureLabel
} from '$lib/models'

export const lecturerRoles = ['MAIN', 'SUB'] as const
export type LecturerRole = (typeof lecturerRoles)[number]

export const lecturerSendDocumentAddressTypes = [
  'HOME',
  'ORGANIZATION'
] as const
export type LecturerSendDocumentAddressType =
  (typeof lecturerSendDocumentAddressTypes)[number]

export class Lecturer {
  public readonly id!: number
  public readonly masterLecturerAffiliatedOrganizationId?: number
  public readonly firstName!: string
  public readonly lastName!: string
  public readonly businessName!: string
  public readonly firstNameKana!: string
  public readonly lastNameKana!: string
  public readonly bussinessNameKana!: string
  public readonly imageUrl?: string
  public readonly role!: LecturerRole
  public readonly sendDocumentAddressType!: LecturerSendDocumentAddressType
  public readonly archived!: boolean
  public readonly isJoinedMailingList!: boolean
  public readonly isAvailableReviewTeachingMaterial!: boolean
  public readonly transportationExpenses?: number
  public readonly privacyPolicyMemorandumConfirmedDate?: Date
  public readonly privacyPolicyAgreedDate?: Date
  public readonly postalCode!: string
  public readonly prefectureCode?: number
  public readonly city!: string
  public readonly town!: string
  public readonly addressLine!: string
  public readonly teachingMaterialAchivementsNote!: string
  public readonly attentionNote!: string
  public readonly note!: string
  public masterLecturerAffiliatedOrganization?: MasterLecturerAffiliatedOrganization
  public masterLecturerCategories: MasterLecturerCategory[] = []
  public masterSeminarDomains: MasterSeminarDomain[] = []
  public lecturerContacts: LecturerContact[] = []
  /**
   * TODO:
   * lecturerContract
   * lecturerDetails
   * lecturerEmergencyContacts
   * lecturerPins
   */

  constructor(init: Partial<Lecturer>) {
    const {
      masterLecturerAffiliatedOrganization,
      masterLecturerCategories,
      masterSeminarDomains,
      lecturerContacts,
      ...attr
    } = init
    Object.assign(this, attr)

    if (masterLecturerAffiliatedOrganization) {
      this.masterLecturerAffiliatedOrganization =
        new MasterLecturerAffiliatedOrganization(
          masterLecturerAffiliatedOrganization
        )
    }

    if (masterLecturerCategories) {
      this.masterLecturerCategories = masterLecturerCategories.map(
        (masterLecturerCategory) =>
          new MasterLecturerCategory(masterLecturerCategory)
      )
    }

    if (masterSeminarDomains) {
      this.masterSeminarDomains = masterSeminarDomains.map(
        (masterSeminarDomain) => new MasterSeminarDomain(masterSeminarDomain)
      )
    }

    if (lecturerContacts) {
      this.lecturerContacts = lecturerContacts.map(
        (lecturerContact) => new LecturerContact(lecturerContact)
      )
    }
  }

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`
  }

  get fullNameKana(): string {
    return `${this.lastNameKana} ${this.firstNameKana}`
  }

  get prefecture(): string {
    if (this.prefectureCode) {
      return convertPrefectureLabel(this.prefectureCode)
    } else {
      return ''
    }
  }

  get fullAddress(): string {
    return `${this.prefecture} ${this.city} ${this.town} ${this.addressLine}`
  }

  get roleLabel(): string {
    return convertLecturerRoleLabel(this.role)
  }

  get sendDocumentAddressTypeLabel(): string {
    return convertLecturerSendDocumentAddressTypeLabel(
      this.sendDocumentAddressType
    )
  }

  get transportationExpensesDisplay() {
    if (this.transportationExpenses) {
      return `¥${this.transportationExpenses.toLocaleString()}`
    } else {
      return ''
    }
  }

  get lecturerContactsOfEmail() {
    return this.lecturerContacts.filter(
      (lecturerContact) => lecturerContact.type === 'EMAIL'
    )
  }

  get lecturerContactsOfPhone() {
    return this.lecturerContacts.filter(
      (lecturerContact) => lecturerContact.type === 'PHONE'
    )
  }
}

export const convertLecturerRoleLabel = (type: LecturerRole) => {
  switch (type) {
    case 'MAIN': {
      return 'メイン'
    }
    case 'SUB': {
      return 'サブ'
    }
    default: {
      return ''
    }
  }
}

export const convertLecturerSendDocumentAddressTypeLabel = (
  type: LecturerSendDocumentAddressType
) => {
  switch (type) {
    case 'HOME': {
      return '自宅'
    }
    case 'ORGANIZATION': {
      return '所属組織'
    }
    default: {
      return ''
    }
  }
}
