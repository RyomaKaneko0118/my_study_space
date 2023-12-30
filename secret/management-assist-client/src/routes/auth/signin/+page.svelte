<script lang="ts">
  import { AxiosError } from 'axios'
  import { createForm } from 'svelte-forms-lib'
  import * as yup from 'yup'

  import { PUBLIC_TITLE } from '$env/static/public'

  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import authAPI from '$api/auth'
  import { adminsQueries } from '$api/graphql/admins'

  import imgLogo from '$assets/images/logo.png'

  import { admins, loading, serverError } from '$stores/app'
  import { authenticatedAdmin } from '$stores/auth'

  import apolloClient from '$lib/apollo'
  import { Admin } from '$lib/models'

  import CommonButton from '$lib/components/CommonButton.svelte'
  import CommonInput from '$lib/components/CommonInput.svelte'

  let unauthorized = false

  const resetError = () => {
    unauthorized = false
    errors.set({
      email: '',
      password: ''
    })
  }

  const { form, errors, handleSubmit } = createForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required()
    }),
    onSubmit: async (values) => {
      loading.set(true)
      try {
        await authAPI.signin(values)
      } catch (error) {
        if (error instanceof AxiosError) {
          switch (error.response?.status) {
            case 401: {
              unauthorized = true
              return
            }
          }
        }
        serverError.set(true)
        return
      } finally {
        loading.set(false)
      }

      try {
        const result = await apolloClient.query({
          query: adminsQueries.getAuthenticatedAdmin,
          fetchPolicy: 'no-cache'
        })
        authenticatedAdmin.set(new Admin(result.data.authenticatedAdmin))

        try {
          const result = await apolloClient.query({
            query: adminsQueries.getAdmins,
            fetchPolicy: 'no-cache'
          })
          admins.set(result.data.admins.map((admin: Admin) => new Admin(admin)))
        } catch {
          /* empty */
        }
      } catch {
        serverError.set(true)
        return
      } finally {
        loading.set(false)
      }

      const redirectPath = $page.url.searchParams.get('redirect')
      if (redirectPath) {
        goto(redirectPath)
      } else {
        goto('/')
      }
    }
  })
</script>

<svelte:head>
  <title>ログイン | {PUBLIC_TITLE}</title>
</svelte:head>

<section
  class="p-md flex-1 d-flex flex-direction-column align-items-center justify-content-center"
>
  <img src={imgLogo} alt="logo" class="logo" />
  <div class="card">
    {#if unauthorized}
      <small class="d-block mb-md text-error text-center fs-sm"
        >メールアドレスまたは、パスワードに誤りがあります。</small
      >
    {/if}
    <form on:submit={handleSubmit}>
      <div class="mb-md">
        <CommonInput
          placeholder="メールアドレス"
          invalid={!!$errors.email}
          bind:value={$form.email}
          on:input={resetError}
        />
        {#if $errors.email}
          <small class="d-block mt-xs text-error fs-sm">{$errors.email}</small>
        {/if}
      </div>
      <div class="mb-md">
        <CommonInput
          type="password"
          placeholder="パスワード"
          invalid={!!$errors.password}
          bind:value={$form.password}
          on:input={resetError}
        />
        {#if $errors.password}
          <small class="d-block mt-xs text-error fs-sm"
            >{$errors.password}</small
          >
        {/if}
      </div>
      <CommonButton type="submit" variant="primary" class="mt-md"
        >ログイン</CommonButton
      >
    </form>
  </div>
</section>

<style lang="scss">
  .logo {
    width: 350px;
    margin: -85px auto 40px auto;
  }

  .card {
    padding: 40px 45px;

    @include mq(md) {
      width: 450px;
    }
  }
</style>
