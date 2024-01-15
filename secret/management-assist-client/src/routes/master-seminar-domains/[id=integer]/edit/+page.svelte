<script lang="ts">
  import { ApolloError } from '@apollo/client/core'
  import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { goto } from '$app/navigation'

  import {
    masterSeminarDomainsMutations,
    type UpdateMasterSeminarDomainInput
  } from '$api/graphql/master-seminar-domains'

  import { loading, serverError } from '$stores/app'
  import { masterSeminarDomain } from '$stores/master-seminar-domains'

  import apolloClient from '$lib/apollo'
  import { MasterSeminarDomain } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  $: hasChanged = $form.name !== $masterSeminarDomain.name

  let showUpdatedModal = false

  const beforeMasterSeminarDomainName = $masterSeminarDomain.name

  const resetError = () => {
    errors.set({
      name: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      name: $masterSeminarDomain.name
    },
    validationSchema: yup.object().shape({
      name: yup.string().required()
    }),
    onSubmit: async (values) => {
      const input: UpdateMasterSeminarDomainInput = {
        id: $masterSeminarDomain.id,
        name: values.name
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: masterSeminarDomainsMutations.updateMasterSeminarDomain,
          variables: {
            updateMasterSeminarDomainInput: input
          }
        })
        masterSeminarDomain.set(
          new MasterSeminarDomain(result.data.updateMasterSeminarDomain)
        )
        showUpdatedModal = true
      } catch (e) {
        if (e instanceof ApolloError) {
          const { graphQLErrors } = e
          if (
            graphQLErrors[0].extensions.code === 'UNPROCESSABLE_ENTITY' &&
            graphQLErrors[0].message === 'DUPLICATE_NAME'
          ) {
            errors.set({
              ...$errors,
              name: 'すでに登録されている研修分野名です'
            })
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
      <Fa icon={faLayerGroup} />
      <span class="ml-sm">{$masterSeminarDomain.name}</span>
    </h1>
  </div>
  <div class="card my-md py-lg px-md">
    <form class="form" on:submit={handleSubmit}>
      <div class="input-group">
        <label for="name">
          <p>研修分野名</p>
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
  show={showUpdatedModal}
  title="完了"
  message="{beforeMasterSeminarDomainName}を更新しました。"
  on:close={() => goto(`/master-seminar-domains/${$masterSeminarDomain.id}`)}
/>
