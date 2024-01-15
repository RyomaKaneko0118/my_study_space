<script lang="ts">
  import { ApolloError } from '@apollo/client/core'
  import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import {
    masterLecturerAffiliatedOrganizationsMutations,
    type UpdateMasterLecturerAffiliatedOrganizationInput
  } from '$api/graphql/master-lecturer-affiliated-organizations'
  import zipcloudAPI from '$api/zipcloud'

  import { loading, serverError } from '$stores/app'
  import { masterLecturerAffiliatedOrganization } from '$stores/master-lecturer-affiliated-organizations'

  import apolloClient from '$lib/apollo'
  import {
    MasterLecturerAffiliatedOrganization,
    prefectureCodes,
    convertPrefectureLabel
  } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'
  import CommonSelect from '$lib/components/CommonSelect.svelte'

  $: hasChanged =
    $form.name !== $masterLecturerAffiliatedOrganization.name ||
    $form.representativeName !==
      $masterLecturerAffiliatedOrganization.representativeName ||
    $form.representativePost !==
      $masterLecturerAffiliatedOrganization.representativePost ||
    (!$masterLecturerAffiliatedOrganization.corporateNumber &&
      !!$form.corporateNumber) ||
    (!!$masterLecturerAffiliatedOrganization.corporateNumber &&
      $form.corporateNumber !==
        $masterLecturerAffiliatedOrganization.corporateNumber) ||
    (!$masterLecturerAffiliatedOrganization.invoiceNumber &&
      !!$form.invoiceNumber) ||
    (!!$masterLecturerAffiliatedOrganization.invoiceNumber &&
      $form.invoiceNumber !==
        $masterLecturerAffiliatedOrganization.invoiceNumber) ||
    (!$masterLecturerAffiliatedOrganization.equityStock &&
      !!$form.equityStock) ||
    (!!$masterLecturerAffiliatedOrganization.equityStock &&
      Number($form.equityStock) !==
        $masterLecturerAffiliatedOrganization.equityStock) ||
    $form.link !== $masterLecturerAffiliatedOrganization.link ||
    $form.phoneNumber !== $masterLecturerAffiliatedOrganization.phoneNumber ||
    $form.postalCode !== $masterLecturerAffiliatedOrganization.postalCode ||
    (!$masterLecturerAffiliatedOrganization.prefectureCode &&
      !!$form.prefectureCode) ||
    (!!$masterLecturerAffiliatedOrganization.prefectureCode &&
      $form.prefectureCode !==
        $masterLecturerAffiliatedOrganization.prefectureCode) ||
    $form.city !== $masterLecturerAffiliatedOrganization.city ||
    $form.town !== $masterLecturerAffiliatedOrganization.town ||
    $form.addressLine !== $masterLecturerAffiliatedOrganization.addressLine

  let showUpdatedModal = false
  let showZipcloudErrorModal = false

  const beforeMasterLecturerAffiliatedOrganizationName =
    $masterLecturerAffiliatedOrganization.name

  const prefectureOptions = [
    { label: '未選択' },
    ...prefectureCodes.map((prefectureCode) => {
      return {
        label: convertPrefectureLabel(prefectureCode),
        value: prefectureCode
      }
    })
  ]

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

  const resetError = () => {
    errors.set({
      name: '',
      representativeName: '',
      representativePost: '',
      corporateNumber: '',
      invoiceNumber: '',
      equityStock: '',
      link: '',
      phoneNumber: '',
      postalCode: '',
      prefectureCode: '',
      city: '',
      town: '',
      addressLine: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      name: $masterLecturerAffiliatedOrganization.name,
      representativeName:
        $masterLecturerAffiliatedOrganization.representativeName,
      representativePost:
        $masterLecturerAffiliatedOrganization.representativePost,
      corporateNumber:
        $masterLecturerAffiliatedOrganization.corporateNumber || undefined,
      invoiceNumber:
        $masterLecturerAffiliatedOrganization.invoiceNumber || undefined,
      equityStock:
        $masterLecturerAffiliatedOrganization.equityStock || undefined,
      link: $masterLecturerAffiliatedOrganization.link,
      phoneNumber: $masterLecturerAffiliatedOrganization.phoneNumber,
      postalCode: $masterLecturerAffiliatedOrganization.postalCode,
      prefectureCode:
        $masterLecturerAffiliatedOrganization.prefectureCode || undefined,
      city: $masterLecturerAffiliatedOrganization.city,
      town: $masterLecturerAffiliatedOrganization.town,
      addressLine: $masterLecturerAffiliatedOrganization.addressLine
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      representativeName: yup.string(),
      representativePost: yup.string(),
      corporateNumber: yup.string(),
      invoiceNumber: yup.string(),
      equityStock: yup
        .number()
        .transform((value) => {
          return Number.isNaN(value) ? undefined : value
        })
        .min(1),
      link: yup.string().url(),
      phoneNumber: yup.string(),
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
      addressLine: yup.string()
    }),
    onSubmit: async (values) => {
      const input: UpdateMasterLecturerAffiliatedOrganizationInput = {
        id: $masterLecturerAffiliatedOrganization.id,
        ...values,
        corporateNumber: values.corporateNumber || null,
        invoiceNumber: values.invoiceNumber || null,
        equityStock: values.equityStock ? Number(values.equityStock) : null,
        prefectureCode: values.prefectureCode || null
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation:
            masterLecturerAffiliatedOrganizationsMutations.updateMasterLecturerAffiliatedOrganization,
          variables: {
            updateMasterLecturerAffiliatedOrganizationInput: input
          }
        })
        masterLecturerAffiliatedOrganization.set(
          new MasterLecturerAffiliatedOrganization(
            result.data.updateMasterLecturerAffiliatedOrganization
          )
        )
        showUpdatedModal = true
      } catch (e) {
        if (e instanceof ApolloError) {
          const { graphQLErrors } = e
          if (
            graphQLErrors[0].extensions.code === 'UNPROCESSABLE_ENTITY' &&
            graphQLErrors[0].message === 'DUPLICATE_ATTRIBUTES'
          ) {
            const validateUniqueAttributes = graphQLErrors[0].extensions
              .description as {
              name: boolean
              corporateNumber: boolean
              invoiceNumber: boolean
            }
            if (!validateUniqueAttributes.name) {
              errors.set({
                ...$errors,
                name: 'すでに登録されている組織名です'
              })
            }

            if (!validateUniqueAttributes.corporateNumber) {
              errors.set({
                ...$errors,
                corporateNumber: 'すでに登録されている法人番号です'
              })
            }

            if (!validateUniqueAttributes.invoiceNumber) {
              errors.set({
                ...$errors,
                invoiceNumber: 'すでに登録されている適格請求書登録番号です'
              })
            }
            return
          }
        }
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
      <Fa icon={faUserGroup} />
      <span class="ml-sm">{$masterLecturerAffiliatedOrganization.name}</span>
    </h1>
  </div>
  <div class="card my-md py-lg px-md">
    <form class="form" on:submit={handleSubmit}>
      <div class="input-group">
        <label for="name">
          <p>組織名</p>
          <p class="fs-xs fw-bold text-error">【必須】</p>
        </label>
        <CommonInput
          id="name"
          invalid={!!$errors.name}
          bind:value={$form.name}
          on:input={resetError}
        />
      </div>
      {#if $errors.name}
        <small class="error">{$errors.name}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="representativeName">代表者名</label>
        <CommonInput
          id="representativeName"
          invalid={!!$errors.representativeName}
          bind:value={$form.representativeName}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="representativePost">代表者役職</label>
        <CommonInput
          id="representativePost"
          invalid={!!$errors.representativePost}
          bind:value={$form.representativePost}
          on:input={resetError}
        />
      </div>
      <div class="input-group mt-md">
        <label for="corporateNumber">法人番号</label>
        <CommonInput
          id="corporateNumber"
          invalid={!!$errors.corporateNumber}
          bind:value={$form.corporateNumber}
          on:input={resetError}
        />
      </div>
      {#if $errors.corporateNumber}
        <small class="error">{$errors.corporateNumber}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="invoiceNumber">適格請求書登録番号</label>
        <CommonInput
          id="invoiceNumber"
          invalid={!!$errors.invoiceNumber}
          bind:value={$form.invoiceNumber}
          on:input={resetError}
        />
      </div>
      {#if $errors.invoiceNumber}
        <small class="error">{$errors.invoiceNumber}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="equityStock">資本金(万円)</label>
        <CommonInput
          id="equityStock"
          type="number"
          invalid={!!$errors.equityStock}
          bind:value={$form.equityStock}
          on:input={resetError}
        />
      </div>
      {#if $errors.equityStock}
        <small class="error">{$errors.equityStock}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="link">リンク</label>
        <CommonInput
          id="link"
          invalid={!!$errors.link}
          bind:value={$form.link}
          on:input={resetError}
        />
      </div>
      {#if $errors.link}
        <small class="error">{$errors.link}</small>
      {/if}
      <div class="input-group mt-md">
        <label for="phoneNumber">電話番号</label>
        <CommonInput
          id="phoneNumber"
          invalid={!!$errors.phoneNumber}
          bind:value={$form.phoneNumber}
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

<CommonModal
  show={showZipcloudErrorModal}
  title="エラー"
  message="郵便番号検索に失敗しました。"
  on:close={() => (showZipcloudErrorModal = false)}
/>

<CommonModal
  show={showUpdatedModal}
  title="完了"
  message="{beforeMasterLecturerAffiliatedOrganizationName}を更新しました。"
  on:close={() =>
    goto(
      `/master-lecturer-affiliated-organizations/${$masterLecturerAffiliatedOrganization.id}`
    )}
/>
