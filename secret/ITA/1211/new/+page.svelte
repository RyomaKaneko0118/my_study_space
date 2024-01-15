<script lang="ts">
  import { faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import type { CreateLecturerContactInput } from '$api/graphql/lecturer-contacts'
  import type { CreateLecturerEmergencyContactInput } from '$api/graphql/lecturer-emergency-contacts'
  import {
    lecturersMutations,
    type CreateLecturerInput
  } from '$api/graphql/lecturers'
  import zipcloudAPI from '$api/zipcloud'

  import imgFileBlank from '$assets/images/file-blank.png'

  import SelectMasterLecturerAffiliatedOrganizationModal from '$routes/lecturers/SelectMasterLecturerAffiliatedOrganizationModal.svelte'
  import SelectMasterSeminarDomainsModal from '$routes/lecturers/SelectMasterSeminarDomainsModal.svelte'

  import { loading, serverError } from '$stores/app'
  import { lecturer } from '$stores/lecturers'
  import { masterLecturerCategories } from '$stores/master-lecturer-categories'

  import apolloClient from '$lib/apollo'
  import { handleChangeFile } from '$lib/input-file'
  import {
    lecturerRoles,
    lecturerSendDocumentAddressTypes,
    prefectureCodes,
    convertLecturerRoleLabel,
    convertLecturerSendDocumentAddressTypeLabel,
    convertPrefectureLabel,
    Lecturer
  } from '$lib/models'
  import type {
    MasterLecturerAffiliatedOrganization,
    MasterSeminarDomain,
    LecturerContactType
  } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonCheckbox from '$lib/components/CommonCheckbox.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonRadioButton from '$lib/components/CommonRadioButton.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'
  import CommonTextarea from '$lib/components/CommonTextarea.svelte'

  $: if ($errors) scrollToInvalidInput()

  let imageInput: HTMLInputElement
  let image: File | null = null
  let imageSrc: string
  let selectedMasterLecturerAffiliatedOrganizationName = '所属組織なし'
  let selectedMasterSeminarDomains: MasterSeminarDomain[] = []
  let showSelectMasterLecturerAffiliatedOrganizationModal = false
  let showSelectMasterSeminarDomainsModal = false
  let showCreatedModalWithId: number | null = null
  let showZipcloudErrorModal = false

  const masterLecturerCategoryCandidates = $masterLecturerCategories.map(
    (masterLecturerCategory) => {
      return {
        masterLecturerCategory,
        checked: false
      }
    }
  )

  const roleOptions = lecturerRoles.map((lecturerRole) => {
    return {
      label: convertLecturerRoleLabel(lecturerRole),
      value: lecturerRole
    }
  })

  const sendDocumentAddressTypeOptions = lecturerSendDocumentAddressTypes.map(
    (lecturerSendDocumentAddressType) => {
      return {
        label: convertLecturerSendDocumentAddressTypeLabel(
          lecturerSendDocumentAddressType
        ),
        value: lecturerSendDocumentAddressType
      }
    }
  )

  const prefectureOptions = [
    { label: '未選択' },
    ...prefectureCodes.map((prefectureCode) => {
      return {
        label: convertPrefectureLabel(prefectureCode),
        value: prefectureCode
      }
    })
  ]

  const scrollToInvalidInput = async () => {
    await tick()
    document.getElementsByClassName('invalid')[0]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const addContact = (type: LecturerContactType) => {
    $form.createLecturerContactInputs = [
      ...$form.createLecturerContactInputs,
      {
        type,
        label: '',
        value: ''
      }
    ]
  }

  const addEmergencyContact = () => {
    $form.createLecturerEmergencyContactInputs = [
      ...$form.createLecturerEmergencyContactInputs,
      {
        name: '',
        relationship: '',
        phoneNumber: ''
      }
    ]
  }

  const deleteContact = (index: number) => {
    resetError()
    $form.createLecturerContactInputs =
      $form.createLecturerContactInputs.filter((_, i) => i !== index)
  }

  const deleteEmergencyContact = (index: number) => {
    resetError()
    $form.createLecturerEmergencyContactInputs =
      $form.createLecturerEmergencyContactInputs.filter((_, i) => i !== index)
  }

  const contactErrorFormatter = (error: unknown) => {
    return error as {
      label: string
      value: string
    }
  }

  const emergencyContactErrorFormatter = (error: unknown) => {
    return error as {
      name: string
      relationship: string
      phoneNumber: string
    }
  }

  const onInputPrefectureCode = () => {
    resetError()
    $form.postalCode = ''
    $form.city = ''
    $form.town = ''
    $form.addressLine = ''
  }

  const searchAddressByPostalCode = async () => {
    loading.set(true)

    try {
      const result = await zipcloudAPI.search($form.postalCode)

      if (result.data.status === 200 && result.data.results[0]) {
        const addressResult = result.data.results[0]
        $form.prefectureCode = Number(addressResult.prefcode)
        $form.city = addressResult.address2
        $form.town = addressResult.address3
        $form.addressLine = ''
      } else {
        showZipcloudErrorModal = true
      }
    } catch {
      showZipcloudErrorModal = true
    } finally {
      loading.set(false)
    }
  }

  const onChangeImage = (payload: Event) => {
    handleChangeFile({
      payload,
      accept: 'IMAGE',
      callback: (file: File) => {
        image = file
        imageSrc = URL.createObjectURL(file)
      }
    })
  }

  const onSelectMasterLecturerAffiliatedOrganization = (
    masterLecturerAffiliatedOrganization?: MasterLecturerAffiliatedOrganization
  ) => {
    resetError()
    if (masterLecturerAffiliatedOrganization) {
      $form.masterLecturerAffiliatedOrganizationId =
        masterLecturerAffiliatedOrganization.id
      selectedMasterLecturerAffiliatedOrganizationName =
        masterLecturerAffiliatedOrganization.name
    } else {
      $form.masterLecturerAffiliatedOrganizationId = undefined
      $form.sendDocumentAddressType = 'HOME'
      selectedMasterLecturerAffiliatedOrganizationName = '所属組織なし'
    }
    showSelectMasterLecturerAffiliatedOrganizationModal = false
  }

  const resetError = () => {
    errors.set({
      masterLecturerAffiliatedOrganizationId: '',
      firstName: '',
      lastName: '',
      businessName: '',
      firstNameKana: '',
      lastNameKana: '',
      bussinessNameKana: '',
      role: '',
      sendDocumentAddressType: '',
      isJoinedMailingList: '',
      isAvailableReviewTeachingMaterial: '',
      transportationExpenses: '',
      privacyPolicyMemorandumConfirmedDate: '',
      privacyPolicyAgreedDate: '',
      postalCode: '',
      prefectureCode: '',
      city: '',
      town: '',
      addressLine: '',
      teachingMaterialAchivementsNote: '',
      attentionNote: '',
      note: '',
      createLecturerContactInputs: '',
      createLecturerEmergencyContactInputs: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      masterLecturerAffiliatedOrganizationId: undefined as undefined | number,
      firstName: '',
      lastName: '',
      businessName: '',
      firstNameKana: '',
      lastNameKana: '',
      bussinessNameKana: '',
      role: roleOptions[0].value,
      sendDocumentAddressType: sendDocumentAddressTypeOptions[0].value,
      isJoinedMailingList: false,
      isAvailableReviewTeachingMaterial: false,
      transportationExpenses: undefined as undefined | number,
      privacyPolicyMemorandumConfirmedDate: undefined as undefined | string,
      privacyPolicyAgreedDate: undefined as undefined | string,
      postalCode: '',
      prefectureCode: undefined as undefined | number,
      city: '',
      town: '',
      addressLine: '',
      teachingMaterialAchivementsNote: '',
      attentionNote: '',
      note: '',
      createLecturerContactInputs: [] as CreateLecturerContactInput[],
      createLecturerEmergencyContactInputs:
        [] as CreateLecturerEmergencyContactInput[]
    },
    validationSchema: yup.object().shape({
      masterLecturerAffiliatedOrganizationId: yup.number(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      businessName: yup.string(),
      firstNameKana: yup.string(),
      lastNameKana: yup.string(),
      bussinessNameKana: yup.string(),
      role: yup.string().required(),
      sendDocumentAddressType: yup.string().required(),
      transportationExpenses: yup
        .number()
        .transform((value) => {
          return Number.isNaN(value) ? undefined : value
        })
        .min(1),
      privacyPolicyMemorandumConfirmedDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue ? value : undefined
        }),
      privacyPolicyAgreedDate: yup.date().transform((value, originalValue) => {
        return originalValue ? value : undefined
      }),
      postalCode: yup.lazy((value) =>
        !value
          ? yup.string()
          : yup
              .string()
              .matches(
                /^[0-9]{3}-?[0-9]{4}$/,
                '半角数字7桁(ハイフン任意)で入力してください'
              )
      ),
      prefectureCode: yup.number().min(1).max(47),
      city: yup.string(),
      town: yup.string(),
      addressLine: yup.string(),
      teachingMaterialAchivementsNote: yup.string(),
      attentionNote: yup.string(),
      note: yup.string(),
      createLecturerContactInputs: yup.array().of(
        yup.object().shape({
          type: yup.string().required(),
          label: yup.string().required(),
          value: yup
            .string()
            .required()
            .when('type', {
              is: (type: string) => type === 'EMAIL',
              then: (schema) => {
                return schema.email()
              }
            })
        })
      ),
      createLecturerEmergencyContactInputs: yup.array().of(
        yup.object().shape({
          name: yup.string().required(),
          relationship: yup.string().required(),
          phoneNumber: yup.string().required()
        })
      )
    }),
    onSubmit: async (values) => {
      const input: CreateLecturerInput = {
        ...values,
        masterLecturerAffiliatedOrganizationId:
          values.masterLecturerAffiliatedOrganizationId || undefined,
        image,
        transportationExpenses: values.transportationExpenses
          ? Number(values.transportationExpenses)
          : undefined,
        privacyPolicyMemorandumConfirmedDate:
          values.privacyPolicyMemorandumConfirmedDate
            ? new Date(values.privacyPolicyMemorandumConfirmedDate)
            : undefined,
        privacyPolicyAgreedDate: values.privacyPolicyAgreedDate
          ? new Date(values.privacyPolicyAgreedDate)
          : undefined,
        connectMasterLecturerCategoryIds: masterLecturerCategoryCandidates
          .filter(
            (masterLecturerCategoryCandidate) =>
              masterLecturerCategoryCandidate.checked
          )
          .map(
            (masterLecturerCategoryCandidate) =>
              masterLecturerCategoryCandidate.masterLecturerCategory.id
          ),
        connectMasterSeminarDomainIds: selectedMasterSeminarDomains.map(
          (masterSeminarDomain) => masterSeminarDomain.id
        )
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: lecturersMutations.createLecturer,
          variables: {
            createLecturerInput: input
          }
        })
        lecturer.set(new Lecturer(result.data.createLecturer))
        showCreatedModalWithId = result.data.createLecturer.id
      } catch {
        serverError.set(true)
      } finally {
        loading.set(false)
      }
    }
  })
</script>

<svelte:head>
  <title>講師登録 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1 class="text-primary">
    <Fa icon={faUser} />
    <span class="ml-sm">講師登録</span>
  </h1>
  <div class="card my-md py-lg px-md">
    <form class="form" on:submit={handleSubmit}>
      <div class="input-group">
        <label for="image">画像</label>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="image-wrapper hoverable clickable"
          class:blank={!imageSrc}
          on:click={() => imageInput.click()}
        >
          <img src={imageSrc || imgFileBlank} alt="logo" />
          <input
            type="file"
            accept="image/*"
            class="d-none"
            bind:this={imageInput}
            on:change={onChangeImage}
          />
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="name">
          <p>氏名</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="lastName"
          class="mr-xs"
          placeholder="氏"
          invalid={!!$errors.lastName}
          bind:value={$form.lastName}
          on:input={resetError}
        />
        <CommonInput
          id="firstName"
          class="ml-xs"
          placeholder="名"
          invalid={!!$errors.firstName}
          bind:value={$form.firstName}
          on:input={resetError}
        />
      </div>
      {#if $errors.lastName || $errors.firstName}
        <small class="error">{$errors.lastName || $errors.firstName}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="nameKana">氏名(かな)</label>
        <CommonInput
          id="lastNameKana"
          class="mr-xs"
          placeholder="氏(かな)"
          invalid={!!$errors.lastNameKana}
          bind:value={$form.lastNameKana}
          on:input={resetError}
        />
        <CommonInput
          id="firstNameKana"
          class="ml-xs"
          placeholder="名(かな)"
          invalid={!!$errors.firstNameKana}
          bind:value={$form.firstNameKana}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="businessName">ビジネスネーム</label>
        <CommonInput
          id="businessName"
          invalid={!!$errors.businessName}
          bind:value={$form.businessName}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="bussinessNameKana">ビジネスネーム(かな)</label>
        <CommonInput
          id="bussinessNameKana"
          invalid={!!$errors.bussinessNameKana}
          bind:value={$form.bussinessNameKana}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="masterLecturerAffiliatedOrganizationId">所属組織</label>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="w-100"
          on:click={() =>
            (showSelectMasterLecturerAffiliatedOrganizationModal = true)}
        >
          <CommonInput
            id="masterLecturerAffiliatedOrganizationId"
            readonly
            bind:value={selectedMasterLecturerAffiliatedOrganizationName}
            on:input={resetError}
          />
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="emails">メールアドレス</label>
        <div class="w-100 d-flex flex-direction-column">
          <div>
            {#each $form.createLecturerContactInputs as createLecturerContactInput, i}
              {#if createLecturerContactInput.type === 'EMAIL'}
                {@const error = contactErrorFormatter(
                  $errors.createLecturerContactInputs[i]
                )}
                <div class="mb-sm">
                  <div class="d-flex">
                    <div>
                      <CommonInput
                        name="label"
                        class="mr-xs"
                        placeholder="項目名"
                        invalid={!!error?.label}
                        bind:value={createLecturerContactInput.label}
                        on:input={resetError}
                      />
                    </div>
                    <CommonInput
                      name="email"
                      class="ml-xs"
                      placeholder="メールアドレス"
                      invalid={!!error?.value}
                      bind:value={createLecturerContactInput.value}
                      on:input={resetError}
                    />
                    <div class="delete-btn-wrapper ml-md text-error">
                      <button type="button" on:click={() => deleteContact(i)}>
                        <Fa icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  {#if error}
                    <small class="error">{error.label || error.value}</small>
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
          <div class="add-btn-wrapper">
            <CommonButton
              variant="secondary"
              size="sm"
              outline
              on:click={() => addContact('EMAIL')}>追加</CommonButton
            >
          </div>
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="emails">電話番号</label>
        <div class="w-100 d-flex flex-direction-column">
          <div>
            {#each $form.createLecturerContactInputs as createLecturerContactInput, i}
              {#if createLecturerContactInput.type === 'PHONE'}
                {@const error = contactErrorFormatter(
                  $errors.createLecturerContactInputs[i]
                )}
                <div class="mb-sm">
                  <div class="d-flex">
                    <div>
                      <CommonInput
                        name="label"
                        class="mr-xs"
                        placeholder="項目名"
                        invalid={!!error?.label}
                        bind:value={createLecturerContactInput.label}
                        on:input={resetError}
                      />
                    </div>
                    <CommonInput
                      name="phoneNumber"
                      class="ml-xs"
                      placeholder="電話番号"
                      invalid={!!error?.value}
                      bind:value={createLecturerContactInput.value}
                      on:input={resetError}
                    />
                    <div class="delete-btn-wrapper ml-md text-error">
                      <button type="button" on:click={() => deleteContact(i)}>
                        <Fa icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  {#if error}
                    <small class="error">{error.label || error.value}</small>
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
          <div class="add-btn-wrapper">
            <CommonButton
              variant="secondary"
              size="sm"
              outline
              on:click={() => addContact('PHONE')}>追加</CommonButton
            >
          </div>
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="lecturerEmergencyContacts">緊急連絡先</label>
        <div class="w-100 d-flex flex-direction-column">
          <div>
            {#each $form.createLecturerEmergencyContactInputs as createLecturerEmergencyContactInput, i}
              {@const error = emergencyContactErrorFormatter(
                $errors.createLecturerEmergencyContactInputs[i]
              )}
              <div class="mb-sm">
                <div class="d-flex">
                  <CommonInput
                    name="name"
                    class="mr-xs"
                    placeholder="氏名"
                    invalid={!!error?.name}
                    bind:value={createLecturerEmergencyContactInput.name}
                    on:input={resetError}
                  />
                  <div class="delete-btn-wrapper ml-md text-error">
                    <button
                      type="button"
                      on:click={() => deleteEmergencyContact(i)}
                    >
                      <Fa icon={faTrash} />
                    </button>
                  </div>
                </div>
                <div class="d-flex mt-xs">
                  <div>
                    <CommonInput
                      name="relationship"
                      class="mr-xs"
                      placeholder="続柄"
                      invalid={!!error?.relationship}
                      bind:value={createLecturerEmergencyContactInput.relationship}
                      on:input={resetError}
                    />
                  </div>
                  <CommonInput
                    name="phoneNumber"
                    class="ml-xs"
                    placeholder="電話番号"
                    invalid={!!error?.phoneNumber}
                    bind:value={createLecturerEmergencyContactInput.phoneNumber}
                    on:input={resetError}
                  />
                </div>
                {#if error}
                  <small class="error"
                    >{error.name ||
                      error.relationship ||
                      error.phoneNumber}</small
                  >
                {/if}
              </div>
            {/each}
          </div>
          <div class="add-btn-wrapper">
            <CommonButton
              variant="secondary"
              size="sm"
              outline
              on:click={addEmergencyContact}>追加</CommonButton
            >
          </div>
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="masterLecturerCategoryIds">担当領域</label>
        <div class="masterLecturerCategories">
          {#each masterLecturerCategoryCandidates as masterLecturerCategoryCandidate}
            <CommonCheckbox
              checked={masterLecturerCategoryCandidate.checked}
              bind:value={masterLecturerCategoryCandidate.checked}
            >
              <span class="ml-sm text-gray"
                >{masterLecturerCategoryCandidate.masterLecturerCategory
                  .name}</span
              >
            </CommonCheckbox>
          {/each}
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="masterLecturerCategoryIds">研修分野</label>
        <div class="w-100 d-flex flex-direction-column">
          <div class="default-badges-wrapper">
            {#each selectedMasterSeminarDomains.sort((a, b) => a.id - b.id) as masterSeminarDomain}
              <span class="badge">{masterSeminarDomain.name}</span>
            {/each}
            {#if selectedMasterSeminarDomains.length !== 0}
              <div>
                <button
                  type="button"
                  class="h-100 ml-xs d-flex align-items-center text-secondary"
                  on:click={() => (showSelectMasterSeminarDomainsModal = true)}
                >
                  <Fa icon={faEdit} />
                </button>
              </div>
            {/if}
          </div>
          {#if selectedMasterSeminarDomains.length === 0}
            <div class="add-btn-wrapper">
              <CommonButton
                variant="secondary"
                size="sm"
                outline
                on:click={() => (showSelectMasterSeminarDomainsModal = true)}
                >追加</CommonButton
              >
            </div>
          {/if}
        </div>
      </div>
      <div class="input-group mt-md">
        <label for="role">役割</label>
        {#each roleOptions as roleOption}
          <CommonRadioButton
            bind:modelValue={$form.role}
            class="mr-md"
            value={roleOption.value}
            label={roleOption.label}
            on:input={resetError}
          />
        {/each}
      </div>
      <div class="input-group mt-md">
        <label for="sendDocumentAddressType">資料送付先</label>
        {#each sendDocumentAddressTypeOptions as sendDocumentAddressTypeOption}
          <CommonRadioButton
            bind:modelValue={$form.sendDocumentAddressType}
            class="mr-md"
            value={sendDocumentAddressTypeOption.value}
            label={sendDocumentAddressTypeOption.label}
            disabled={sendDocumentAddressTypeOption.value === 'ORGANIZATION' &&
              !$form.masterLecturerAffiliatedOrganizationId}
            on:input={resetError}
          />
        {/each}
      </div>
      <div class="input-group mt-md">
        <label for="isJoinedMailingList">ALL ML</label>
        <CommonRadioButton
          bind:modelValue={$form.isJoinedMailingList}
          class="mr-md"
          value={true}
          label="参加"
          on:input={resetError}
        />
        <CommonRadioButton
          bind:modelValue={$form.isJoinedMailingList}
          class="mr-md"
          value={false}
          label="不参加"
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="isAvailableReviewTeachingMaterial">教材開発レビュー</label>
        <CommonRadioButton
          bind:modelValue={$form.isAvailableReviewTeachingMaterial}
          class="mr-md"
          value={true}
          label="可"
          on:input={resetError}
        />
        <CommonRadioButton
          bind:modelValue={$form.isAvailableReviewTeachingMaterial}
          class="mr-md"
          value={false}
          label="不可"
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="transportationExpenses">交通費(円)</label>
        <CommonInput
          id="transportationExpenses"
          type="number"
          invalid={!!$errors.transportationExpenses}
          bind:value={$form.transportationExpenses}
          on:input={resetError}
        />
      </div>
      {#if $errors.transportationExpenses}
        <small class="error">{$errors.transportationExpenses}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="privacyPolicyMemorandumConfirmedDate">
          <p>覚書確認日</p>
          <p>(個人情報取扱)</p>
        </label>
        <CommonInput
          id="privacyPolicyMemorandumConfirmedDate"
          type="date"
          invalid={!!$errors.privacyPolicyMemorandumConfirmedDate}
          bind:value={$form.privacyPolicyMemorandumConfirmedDate}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="privacyPolicyAgreedDate">
          <p>同意日</p>
          <p>(個人情報取扱)</p>
        </label>
        <CommonInput
          id="privacyPolicyAgreedDate"
          type="date"
          invalid={!!$errors.privacyPolicyAgreedDate}
          bind:value={$form.privacyPolicyAgreedDate}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="postalCode">郵便番号</label>
        <CommonInput
          id="postalCode"
          placeholder="ハイフン任意"
          invalid={!!$errors.postalCode}
          bind:value={$form.postalCode}
          on:input={resetError}
        />
        <div class="default-btn-fit-wrapper ml-sm">
          <CommonButton
            variant="secondary"
            size="sm"
            outline
            disabled={!$form.postalCode}
            on:click={searchAddressByPostalCode}>検索</CommonButton
          >
        </div>
      </div>
      {#if $errors.postalCode}
        <small class="error">{$errors.postalCode}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="address">住所</label>
        <CommonSelect
          id="prefectureCode"
          class="mr-xs"
          invalid={!!$errors.prefectureCode}
          options={prefectureOptions}
          bind:value={$form.prefectureCode}
          on:input={onInputPrefectureCode}
        />
        <CommonInput
          id="city"
          class="ml-xs"
          placeholder="市区町村"
          invalid={!!$errors.city}
          bind:value={$form.city}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="town" />
        <CommonInput
          id="town"
          placeholder="町域"
          invalid={!!$errors.town}
          bind:value={$form.town}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="addressLine" />
        <CommonInput
          id="addressLine"
          placeholder="番地 / 建物名"
          invalid={!!$errors.addressLine}
          bind:value={$form.addressLine}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="teachingMaterialAchivementsNote">教材実績メモ</label>
        <CommonTextarea
          id="teachingMaterialAchivementsNote"
          resizable
          invalid={!!$errors.teachingMaterialAchivementsNote}
          bind:value={$form.teachingMaterialAchivementsNote}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="attentionNote">依頼時の注意点</label>
        <CommonTextarea
          id="attentionNote"
          resizable
          invalid={!!$errors.attentionNote}
          bind:value={$form.attentionNote}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="note">メモ</label>
        <CommonTextarea
          id="note"
          resizable
          invalid={!!$errors.note}
          bind:value={$form.note}
          on:input={resetError}
        />
      </div>
      <div class="default-btn-wrapper">
        <CommonButton type="submit" variant="primary" class="mt-lg"
          >登録</CommonButton
        >
      </div>
    </form>
  </div>
</section>

<SelectMasterLecturerAffiliatedOrganizationModal
  show={showSelectMasterLecturerAffiliatedOrganizationModal}
  bind:selectedMasterLecturerAffiliatedOrganizationId={$form.masterLecturerAffiliatedOrganizationId}
  on:select={(e) => onSelectMasterLecturerAffiliatedOrganization(e?.detail)}
  on:close={() => (showSelectMasterLecturerAffiliatedOrganizationModal = false)}
/>

<SelectMasterSeminarDomainsModal
  show={showSelectMasterSeminarDomainsModal}
  {selectedMasterSeminarDomains}
  on:close={() => (showSelectMasterSeminarDomainsModal = false)}
  on:select={(e) => {
    selectedMasterSeminarDomains = e.detail
    showSelectMasterSeminarDomainsModal = false
  }}
/>

<CommonModal
  show={showZipcloudErrorModal}
  title="エラー"
  message="郵便番号検索に失敗しました。"
  on:close={() => (showZipcloudErrorModal = false)}
/>

<CommonModal
  show={showCreatedModalWithId !== null}
  title="完了"
  message="講師を登録しました。"
  on:close={() => goto(`/lecturers/${showCreatedModalWithId}`)}
/>

<style lang="scss">
  .image-wrapper {
    width: 90px;
    height: 120px;
    border: 1px solid $color-border;

    &:not(.blank) img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.blank {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $color-background;

      img {
        width: 27px;
        height: auto;
      }
    }
  }

  .add-btn-wrapper {
    width: 120px;
  }

  .delete-btn-wrapper {
    align-self: center;
  }

  .masterLecturerCategories {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
  }
</style>
