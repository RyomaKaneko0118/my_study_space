<script lang="ts">
  import { ApolloError } from '@apollo/client/core'
  import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'

  import {
    masterSeminarDomainsMutations,
    type CreateMasterSeminarDomainInput
  } from '$api/graphql/master-seminar-domains'

  import { loading, serverError } from '$stores/app'
  import { masterSeminarDomain } from '$stores/master-seminar-domains'

  import apolloClient from '$lib/apollo'
  import { MasterSeminarDomain } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'
  import CommonModal from '$lib/components/CommonModal.svelte'

  let showCreatedModalWithId: number | null = null

  const resetError = () => {
    errors.set({
      name: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      name: ''
    },
    validationSchema: yup.object().shape({
      name: yup.string().required()
    }),
    onSubmit: async (values) => {
      const input: CreateMasterSeminarDomainInput = {
        name: values.name
      }

      loading.set(true)

      try {
        const result = await apolloClient.mutate({
          mutation: masterSeminarDomainsMutations.createMasterSeminarDomain,
          variables: {
            createMasterSeminarDomainInput: input
          }
        })
        masterSeminarDomain.set(
          new MasterSeminarDomain(result.data.createMasterSeminarDomain)
        )
        showCreatedModalWithId = result.data.createMasterSeminarDomain.id
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

<svelte:head>
  <title>研修分野登録 | {PUBLIC_TITLE}</title>
</svelte:head>

<section class="content">
  <h1 class="text-primary">
    <Fa icon={faLayerGroup} />
    <span class="ml-sm">研修分野登録</span>
  </h1>
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
        <CommonButton type="submit" variant="primary" class="mt-lg"
          >登録</CommonButton
        >
      </div>
    </form>
  </div>
</section>

<CommonModal
  show={showCreatedModalWithId !== null}
  title="完了"
  message="研修分野を登録しました。"
  on:close={() => goto(`/master-seminar-domains/${showCreatedModalWithId}`)}
/>
