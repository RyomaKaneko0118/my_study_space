<script lang="ts">
  import { faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
  import dayjs from 'dayjs'
  import { tick } from 'svelte'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import type { CreateLecturerContactInput } from '$api/graphql/lecturer-contacts'
  import {
    lecturersMutations,
    type UpdateLecturerInput
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

  $: hasChanged =
    image !== null ||
    (!$lecturer.masterLecturerAffiliatedOrganizationId &&
      !!$form.masterLecturerAffiliatedOrganizationId) ||
    (!!$lecturer.masterLecturerAffiliatedOrganizationId &&
      $form.masterLecturerAffiliatedOrganizationId !==
        $lecturer.masterLecturerAffiliatedOrganizationId) ||
    $form.firstName !== $lecturer.firstName ||
    $form.lastName !== $lecturer.lastName ||
    $form.businessName !== $lecturer.businessName ||
    $form.firstNameKana !== $lecturer.firstNameKana ||
    $form.lastNameKana !== $lecturer.lastNameKana ||
    $form.bussinessNameKana !== $lecturer.bussinessNameKana ||
    $form.role !== $lecturer.role ||
    $form.sendDocumentAddressType !== $lecturer.sendDocumentAddressType ||
    $form.isJoinedMailingList !== $lecturer.isJoinedMailingList ||
    $form.isAvailableReviewTeachingMaterial !==
      $lecturer.isAvailableReviewTeachingMaterial ||
    (!$lecturer.transportationExpenses && !!$form.transportationExpenses) ||
    (!!$lecturer.transportationExpenses &&
      Number($form.transportationExpenses) !==
        $lecturer.transportationExpenses) ||
    (!!$form.privacyPolicyMemorandumConfirmedDate &&
      !$lecturer.privacyPolicyMemorandumConfirmedDate) ||
    (!!$lecturer.privacyPolicyMemorandumConfirmedDate &&
      !dayjs($form.privacyPolicyMemorandumConfirmedDate).isSame(
        dayjs($lecturer.privacyPolicyMemorandumConfirmedDate),
        'day'
      )) ||
    (!!$form.privacyPolicyAgreedDate && !$lecturer.privacyPolicyAgreedDate) ||
    (!!$lecturer.privacyPolicyAgreedDate &&
      !dayjs($form.privacyPolicyAgreedDate).isSame(
        dayjs($lecturer.privacyPolicyAgreedDate),
        'day'
      )) ||
    $form.postalCode !== $lecturer.postalCode ||
    (!$lecturer.prefectureCode && !!$form.prefectureCode) ||
    (!!$lecturer.prefectureCode &&
      $form.prefectureCode !== $lecturer.prefectureCode) ||
    $form.city !== $lecturer.city ||
    $form.town !== $lecturer.town ||
    $form.addressLine !== $lecturer.addressLine ||
    $form.teachingMaterialAchivementsNote !==
      $lecturer.teachingMaterialAchivementsNote ||
    $form.attentionNote !== $lecturer.attentionNote ||
    $form.note !== $lecturer.note ||
    $form.createLecturerContactInputs.length !== 0 ||
    $form.updateLecturerContactInputs.some((updateLecturerContactInput) => {
      const lecturerContact = $lecturer.lecturerContacts.find(
        (lecturerContact) =>
          lecturerContact.id === updateLecturerContactInput.id
      )
      return (
        lecturerContact &&
        (updateLecturerContactInput.type !== lecturerContact.type ||
          updateLecturerContactInput.label !== lecturerContact.label ||
          updateLecturerContactInput.value !== lecturerContact.value)
      )
    }) ||
    deleteLecturerContactIds.length !== 0 ||
    masterLecturerCategoryCandidates.some(
      (masterLecturerCategoryCandidate) =>
        masterLecturerCategoryCandidate.checked !==
        $lecturer.masterLecturerCategories.some(
          (masterLecturerCategory) =>
            masterLecturerCategory.id ===
            masterLecturerCategoryCandidate.masterLecturerCategory.id
        )
    ) ||
    selectedMasterSeminarDomains.some((masterSeminarDomain) => {
      return !$lecturer.masterSeminarDomains.some(
        (currentMasterSeminarDomain) => {
          return currentMasterSeminarDomain.id === masterSeminarDomain.id
        }
      )
    }) ||
    $lecturer.masterSeminarDomains.some((currentMasterSeminarDomain) => {
      return !selectedMasterSeminarDomains.some((masterSeminarDomain) => {
        return currentMasterSeminarDomain.id === masterSeminarDomain.id
      })
    })

  let deleteLecturerContactIds: number[] = []
  let imageInput: HTMLInputElement
  let image: File | null = null
  let imageSrc = $lecturer.imageUrl
  let selectedMasterLecturerAffiliatedOrganizationName =
    $lecturer.masterLecturerAffiliatedOrganization?.name || '所属組織なし'
  let selectedMasterSeminarDomains: MasterSeminarDomain[] =
    $lecturer.masterSeminarDomains
  let showSelectMasterLecturerAffiliatedOrganizationModal = false
  let showSelectMasterSeminarDomainsModal = false
  let showUpdatedModal = false
  let showZipcloudErrorModal = false

  const masterLecturerCategoryCandidates = $masterLecturerCategories.map(
    (masterLecturerCategory) => {
      return {
        masterLecturerCategory,
        checked: $lecturer.masterLecturerCategories.some(
          (lecturerCategory) =>
            lecturerCategory.id === masterLecturerCategory.id
        )
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

  const deleteContact = (index: number) => {
    resetError()
    $form.createLecturerContactInputs =
      $form.createLecturerContactInputs.filter((_, i) => i !== index)
  }

  const deleteCurrentContact = (id: number) => {
    resetError()
    $form.updateLecturerContactInputs =
      $form.updateLecturerContactInputs.filter(
        (updateLecturerContactInput) => updateLecturerContactInput.id !== id
      )
    deleteLecturerContactIds = [...deleteLecturerContactIds, id]
  }

  const contactErrorFormatter = (error: unknown) => {
    return error as {
      label: string
      value: string
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
      updateLecturerContactInputs: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      masterLecturerAffiliatedOrganizationId:
        $lecturer.masterLecturerAffiliatedOrganizationId || undefined,
      firstName: $lecturer.firstName,
      lastName: $lecturer.lastName,
      businessName: $lecturer.businessName,
      firstNameKana: $lecturer.firstNameKana,
      lastNameKana: $lecturer.lastNameKana,
      bussinessNameKana: $lecturer.bussinessNameKana,
      role: $lecturer.role,
      sendDocumentAddressType: $lecturer.sendDocumentAddressType,
      isJoinedMailingList: $lecturer.isJoinedMailingList,
      isAvailableReviewTeachingMaterial:
        $lecturer.isAvailableReviewTeachingMaterial,
      transportationExpenses: $lecturer.transportationExpenses || undefined,
      privacyPolicyMemorandumConfirmedDate:
        $lecturer.privacyPolicyMemorandumConfirmedDate
          ? dayjs($lecturer.privacyPolicyMemorandumConfirmedDate).format(
              'YYYY-MM-DD'
            )
          : null,
      privacyPolicyAgreedDate: $lecturer.privacyPolicyAgreedDate
        ? dayjs($lecturer.privacyPolicyAgreedDate).format('YYYY-MM-DD')
        : null,
      postalCode: $lecturer.postalCode,
      prefectureCode: $lecturer.prefectureCode || undefined,
      city: $lecturer.city,
      town: $lecturer.town,
      addressLine: $lecturer.addressLine,
      teachingMaterialAchivementsNote:
        $lecturer.teachingMaterialAchivementsNote,
      attentionNote: $lecturer.attentionNote,
      note: $lecturer.note,
      createLecturerContactInputs: [] as CreateLecturerContactInput[],
      updateLecturerContactInputs: $lecturer.lecturerContacts.map(
        (lecturerContact) => {
          return {
            id: lecturerContact.id,
            type: lecturerContact.type,
            label: lecturerContact.label,
            value: lecturerContact.value
          }
        }
      )
    },
    validationSchema: yup.object().shape({
      masterLecturerAffiliatedOrganizationId: yup
        .number()
        .test(
          'lecturerContractContractorTypeValidation',
          '所属組織をなしにする場合は契約名義を個人にして下さい',
          (value) => {
            if (
              value === undefined &&
              $lecturer.lecturerContract?.contractorType === 'ORGANIZATION'
            ) {
              return false
            }
            return true
          }
        ),
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
      updateLecturerContactInputs: yup.array().of(
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
      )
    }),
    onSubmit: async (values) => {
      const input: UpdateLecturerInput = {
        id: $lecturer.id,
        ...values,
        masterLecturerAffiliatedOrganizationId:
          values.masterLecturerAffiliatedOrganizationId || null,
        image,
        transportationExpenses: values.transportationExpenses
          ? Number(values.transportationExpenses)
          : null,
        privacyPolicyMemorandumConfirmedDate:
          values.privacyPolicyMemorandumConfirmedDate
            ? new Date(values.privacyPolicyMemorandumConfirmedDate)
            : null,
        privacyPolicyAgreedDate: values.privacyPolicyAgreedDate
          ? new Date(values.privacyPolicyAgreedDate)
          : null,
        prefectureCode: values.prefectureCode || null,
        deleteLecturerContactIds,
        connectMasterLecturerCategoryIds: masterLecturerCategoryCandidates
          .filter((masterLecturerCategoryCandidate) => {
            return masterLecturerCategoryCandidate.checked
          })
          .map((masterLecturerCategoryCandidate) => {
            return masterLecturerCategoryCandidate.masterLecturerCategory.id
          }),
        disconnectMasterLecturerCategoryIds: masterLecturerCategoryCandidates
          .filter((masterLecturerCategoryCandidate) => {
            return !masterLecturerCategoryCandidate.checked
          })
          .map((masterLecturerCategoryCandidate) => {
            return masterLecturerCategoryCandidate.masterLecturerCategory.id
          }),
        connectMasterSeminarDomainIds: selectedMasterSeminarDomains
          .filter((masterSeminarDomain) => {
            return !$lecturer.masterSeminarDomains.some(
              (currentMasterSeminarDomain) => {
                return currentMasterSeminarDomain.id === masterSeminarDomain.id
              }
            )
          })
          .map((masterSeminarDomain) => masterSeminarDomain.id),
        disconnectMasterSeminarDomainIds: $lecturer.masterSeminarDomains
          .filter((currentMasterSeminarDomain) => {
            return !selectedMasterSeminarDomains.some((masterSeminarDomain) => {
              return currentMasterSeminarDomain.id === masterSeminarDomain.id
            })
          })
          .map((currentMasterSeminarDomain) => currentMasterSeminarDomain.id)
      }

      // TODO: contractorTypeがORGANIZATIONかつvalues.masterLecturerAffiliatedOrganizationIdがnullの場合はエラー

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: lecturersMutations.updateLecturer,
          variables: {
            updateLecturerInput: input
          }
        })
        lecturer.set(new Lecturer(result.data.updateLecturer))
        showUpdatedModal = true
      } catch {
        serverError.set(true)
      } finally {
        loading.set(false)
      }
    }
  })
</script>

<section class="content">
  <div class="d-flex justify-content-space-between">
    <h1 class="text-primary">
      <Fa icon={faUser} />
      <span class="ml-sm">{$lecturer.fullName}</span>
    </h1>
  </div>
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
            invalid={!!$errors.masterLecturerAffiliatedOrganizationId}
            bind:value={selectedMasterLecturerAffiliatedOrganizationName}
            on:input={resetError}
          />
        </div>
      </div>
      {#if $errors.masterLecturerAffiliatedOrganizationId}
        <small class="error"
          >{$errors.masterLecturerAffiliatedOrganizationId}</small
        >
      {/if}
      <div class="input-group mt-md">
        <label for="emails">メールアドレス</label>
        <div class="w-100 d-flex flex-direction-column">
          <div>
            {#each $form.updateLecturerContactInputs as updateLecturerContactInput, i}
              {#if updateLecturerContactInput.type === 'EMAIL'}
                {@const error = contactErrorFormatter(
                  $errors.updateLecturerContactInputs[i]
                )}
                <div class="mb-sm">
                  <div class="d-flex">
                    <div>
                      <CommonInput
                        name="label"
                        class="mr-xs"
                        placeholder="項目名"
                        invalid={!!error?.label}
                        bind:value={updateLecturerContactInput.label}
                        on:input={resetError}
                      />
                    </div>
                    <CommonInput
                      name="email"
                      class="ml-xs"
                      placeholder="メールアドレス"
                      invalid={!!error?.value}
                      bind:value={updateLecturerContactInput.value}
                      on:input={resetError}
                    />
                    <div class="delete-btn-wrapper ml-md text-error">
                      <button
                        type="button"
                        on:click={() =>
                          deleteCurrentContact(updateLecturerContactInput.id)}
                      >
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
            {#each $form.updateLecturerContactInputs as updateLecturerContactInput, i}
              {#if updateLecturerContactInput.type === 'PHONE'}
                {@const error = contactErrorFormatter(
                  $errors.updateLecturerContactInputs[i]
                )}
                <div class="mb-sm">
                  <div class="d-flex">
                    <div>
                      <CommonInput
                        name="label"
                        class="mr-xs"
                        placeholder="項目名"
                        invalid={!!error?.label}
                        bind:value={updateLecturerContactInput.label}
                        on:input={resetError}
                      />
                    </div>
                    <CommonInput
                      name="phoneNumber"
                      class="ml-xs"
                      placeholder="電話番号"
                      invalid={!!error?.value}
                      bind:value={updateLecturerContactInput.value}
                      on:input={resetError}
                    />
                    <div class="delete-btn-wrapper ml-md text-error">
                      <button
                        type="button"
                        on:click={() =>
                          deleteCurrentContact(updateLecturerContactInput.id)}
                      >
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
        <p>TODO</p>
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
        <CommonButton
          type="submit"
          variant="primary"
          class="mt-lg"
          disabled={!hasChanged}>更新</CommonButton
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
  show={showUpdatedModal}
  title="完了"
  message="{$lecturer.fullName}を更新しました。"
  on:close={() => goto(`/lecturers/${$lecturer.id}`)}
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
