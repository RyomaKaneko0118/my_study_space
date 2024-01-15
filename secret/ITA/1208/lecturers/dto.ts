import {
  ArgsType,
  InputType,
  Field,
  Int,
  registerEnumType
} from '@nestjs/graphql'
import { LecturerRole, LecturerSendDocumentAddressType } from '@prisma/client'
import { Type } from 'class-transformer'
import { Allow, IsOptional, Max, Min, ValidateNested } from 'class-validator'
import { GraphQLUpload, type FileUpload } from 'graphql-upload'

import { SortDirection } from '@src/www/graphql/field-order'
import {
  CreateLecturerContactInput,
  UpdateLecturerContactInput
} from '@src/www/graphql/lecturer-contacts/dto'
import {
  CreateLecturerEmergencyContactInput,
  UpdateLecturerEmergencyContactInput
} from '@src/www/graphql/lecturer-emergency-contacts/dto'
import { OffsetPaginationArgs } from '@src/www/graphql/offset-pagination'

// NOTE: orderByで直接扱う可能性を考慮しvalueはlowerCamel
export enum LecturersField {
  ID = 'id'
}

registerEnumType(LecturersField, {
  name: 'LecturersField'
})

@ArgsType()
export class LecturersArgs extends OffsetPaginationArgs {
  @Allow()
  name?: string

  @Allow()
  @Field(() => Int)
  masterLecturerCategoryId?: number

  @Allow()
  pinnedOnly?: boolean

  @Allow()
  includeArchived?: boolean

  @Field(() => LecturersField)
  @Allow()
  field?: LecturersField

  @Field(() => SortDirection, { defaultValue: 'asc' })
  @Allow()
  direction?: SortDirection
}

@InputType()
export class CreateLecturerInput {
  @Field(() => Int)
  @Allow()
  masterLecturerAffiliatedOrganizationId?: number

  @Allow()
  firstName: string

  @Allow()
  lastName: string

  @Allow()
  businessName: string

  @Allow()
  firstNameKana: string

  @Allow()
  lastNameKana: string

  @Allow()
  bussinessNameKana: string

  @Field(() => GraphQLUpload)
  @Allow()
  image?: FileUpload

  @Field(() => LecturerRole)
  @Allow()
  role: LecturerRole

  @Field(() => LecturerSendDocumentAddressType)
  @Allow()
  sendDocumentAddressType: LecturerSendDocumentAddressType

  @Allow()
  isJoinedMailingList: boolean

  @Allow()
  isAvailableReviewTeachingMaterial: boolean

  @Field(() => Int)
  @IsOptional()
  @Min(1)
  transportationExpenses?: number

  @Allow()
  privacyPolicyMemorandumConfirmedDate?: Date

  @Allow()
  privacyPolicyAgreedDate?: Date

  @Allow()
  postalCode?: string

  @Field(() => Int)
  @IsOptional()
  @Min(1)
  @Max(47)
  prefectureCode?: number

  @Allow()
  city?: string

  @Allow()
  town?: string

  @Allow()
  addressLine?: string

  @Allow()
  teachingMaterialAchivementsNote: string

  @Allow()
  attentionNote: string

  @Allow()
  note: string

  @ValidateNested()
  @Type(() => CreateLecturerContactInput)
  createLecturerContactInputs?: CreateLecturerContactInput[]

  @ValidateNested()
  @Type(() => CreateLecturerEmergencyContactInput)
  createLecturerEmergencyContactInputs?: CreateLecturerEmergencyContactInput[]

  @Field(() => [Int])
  @Allow()
  connectMasterLecturerCategoryIds?: number[]

  @Field(() => [Int])
  @Allow()
  connectMasterSeminarDomainIds?: number[]
}

@InputType()
export class UpdateLecturerInput {
  @Field(() => Int)
  @Allow()
  id: number

  @Allow()
  archived?: boolean

  @Field(() => Int)
  @Allow()
  masterLecturerAffiliatedOrganizationId?: number

  @Allow()
  firstName?: string

  @Allow()
  lastName?: string

  @Allow()
  businessName?: string

  @Allow()
  firstNameKana?: string

  @Allow()
  lastNameKana?: string

  @Allow()
  bussinessNameKana?: string

  @Field(() => GraphQLUpload)
  @Allow()
  image?: FileUpload

  @Field(() => LecturerRole)
  @Allow()
  role?: LecturerRole

  @Field(() => LecturerSendDocumentAddressType)
  @Allow()
  sendDocumentAddressType?: LecturerSendDocumentAddressType

  @Allow()
  isJoinedMailingList?: boolean

  @Allow()
  isAvailableReviewTeachingMaterial?: boolean

  @Field(() => Int)
  @IsOptional()
  @Min(1)
  transportationExpenses?: number

  @Allow()
  privacyPolicyMemorandumConfirmedDate?: Date

  @Allow()
  privacyPolicyAgreedDate?: Date

  @Allow()
  postalCode?: string

  @Field(() => Int)
  @IsOptional()
  @Min(1)
  @Max(47)
  prefectureCode?: number

  @Allow()
  city?: string

  @Allow()
  town?: string

  @Allow()
  addressLine?: string

  @Allow()
  teachingMaterialAchivementsNote?: string

  @Allow()
  attentionNote?: string

  @Allow()
  note?: string

  @ValidateNested()
  @Type(() => CreateLecturerContactInput)
  createLecturerContactInputs?: CreateLecturerContactInput[]

  @ValidateNested()
  @Type(() => CreateLecturerEmergencyContactInput)
  createLecturerEmergencyContactInputs?: CreateLecturerEmergencyContactInput[]

  @ValidateNested()
  @Type(() => UpdateLecturerContactInput)
  updateLecturerContactInputs?: UpdateLecturerContactInput[]

  @ValidateNested()
  @Type(() => UpdateLecturerEmergencyContactInput)
  updateLecturerEmergencyContactInputs?: UpdateLecturerEmergencyContactInput[]

  @Field(() => [Int])
  @Allow()
  deleteLecturerContactIds?: number[]

  @Field(() => [Int])
  @Allow()
  deleteLecturerEmergencyContactIds?: number[]

  @Field(() => [Int])
  @Allow()
  connectMasterLecturerCategoryIds?: number[]

  @Field(() => [Int])
  @Allow()
  disconnectMasterLecturerCategoryIds?: number[]

  @Field(() => [Int])
  @Allow()
  connectMasterSeminarDomainIds?: number[]

  @Field(() => [Int])
  @Allow()
  disconnectMasterSeminarDomainIds?: number[]
}
