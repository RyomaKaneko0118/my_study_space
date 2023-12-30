export type CreateMasterLecturerAffiliatedOrganizationInput = {
  name: string
  representativeName: string
  representativePost: string
  invoiceNumber?: string
  corporateNumber?: string
  equityStock?: number
  link: string
  phoneNumber: string
  postalCode?: string
  prefectureCode?: number
  city?: string
  town?: string
  addressLine?: string
}

export type UpdateMasterLecturerAffiliatedOrganizationInput = {
  id: number
  name?: string
  representativeName?: string
  representativePost?: string
  invoiceNumber?: string | null
  corporateNumber?: string | null
  equityStock?: number | null
  link?: string
  phoneNumber?: string
  postalCode?: string
  prefectureCode?: number | null
  city?: string
  town?: string
  addressLine?: string
}
