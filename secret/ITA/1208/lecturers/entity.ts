import {
  Field,
  FieldMiddleware,
  Int,
  MiddlewareContext,
  NextFn,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'
import { LecturerRole, LecturerSendDocumentAddressType } from '@prisma/client'

import type { LecturerContact } from '@src/www/graphql/lecturer-contacts/entity'
import type { LecturerContract } from '@src/www/graphql/lecturer-contracts/entity'
import type { LecturerDetail } from '@src/www/graphql/lecturer-details/entity'
import type { LecturerEmergencyContact } from '@src/www/graphql/lecturer-emergency-contacts/entity'
import type { LecturerPin } from '@src/www/graphql/lecturer-pins/entity'
import type { MasterLecturerAffiliatedOrganization } from '@src/www/graphql/master-lecturer-affiliated-organizations/entity'
import type { MasterLecturerCategory } from '@src/www/graphql/master-lecturer-categories/entity'
import type { MasterSeminarDomain } from '@src/www/graphql/master-seminar-domains/entity'
import { OffsetPaginated } from '@src/www/graphql/offset-pagination'

registerEnumType(LecturerRole, {
  name: 'LecturerRole'
})

registerEnumType(LecturerSendDocumentAddressType, {
  name: 'LecturerSendDocumentAddressType'
})

const imagePathToUrlMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  await next()
  if (!ctx.source.imagePath) {
    return null
  }

  return `${process.env.FILE_URL}/${ctx.source.imagePath}`
}

@ObjectType()
export class Lecturer {
  @Field(() => Int)
  id: number
  @Field(() => Int)
  masterLecturerAffiliatedOrganizationId?: number
  firstName: string
  lastName: string
  businessName: string
  firstNameKana: string
  lastNameKana: string
  bussinessNameKana: string
  @Field({ middleware: [imagePathToUrlMiddleware] })
  imageUrl?: string
  @Field(() => LecturerRole)
  role: LecturerRole
  @Field(() => LecturerSendDocumentAddressType)
  sendDocumentAddressType: LecturerSendDocumentAddressType
  archived: boolean
  isJoinedMailingList: boolean
  isAvailableReviewTeachingMaterial: boolean
  @Field(() => Int)
  transportationExpenses?: number
  privacyPolicyMemorandumConfirmedDate?: Date
  privacyPolicyAgreedDate?: Date
  postalCode: string
  @Field(() => Int)
  prefectureCode?: number
  city: string
  town: string
  addressLine: string
  teachingMaterialAchivementsNote: string
  attentionNote: string
  note: string
  masterLecturerAffiliatedOrganization?: MasterLecturerAffiliatedOrganization
  lecturerContract?: LecturerContract
  lecturerDetails?: LecturerDetail[]
  lecturerContacts?: LecturerContact[]
  lecturerEmergencyContacts?: LecturerEmergencyContact[]
  lecturerPins?: LecturerPin[]
  masterLecturerCategories?: MasterLecturerCategory[]
  masterSeminarDomains?: MasterSeminarDomain[]

  /**
   * TODO:
   * lecturerDetails
   */
}

@ObjectType()
export class PaginatedLecturers extends OffsetPaginated(Lecturer) {}
