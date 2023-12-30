import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  from
} from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'
import Cookies from 'js-cookie'

import { PUBLIC_API_URL } from '$env/static/public'

import authAPI from '$api/auth'

const getHeadersWithAuthorization = () => {
  const cookie = Cookies.get('management-assist-session')
  if (cookie) {
    const session: AdminSession = JSON.parse(decodeURIComponent(cookie))
    if (session?.accessToken) {
      return {
        headers: {
          authorization: `Bearer ${session.accessToken}`
        }
      }
    }
  }
  return {
    headers: undefined
  }
}

const apolloLink = new ApolloLink((operation, forward) => {
  operation.setContext(getHeadersWithAuthorization())
  return forward(operation)
})

/**
 * NOTE:
 * GraphQLレスポンスでUnauthorizedを検知し、refreshTokenがCookieに存在する場合には
 * auth/refreshを試行し成功した場合にはretry
 */
const errorLink = onError(({ graphQLErrors, forward, operation }) => {
  if (graphQLErrors && graphQLErrors[0]) {
    const error = graphQLErrors[0]

    if (error.extensions?.code === 'UNAUTHENTICATED') {
      const cookie = Cookies.get('management-assist-session')

      if (cookie) {
        const session: AdminSession = JSON.parse(decodeURIComponent(cookie))
        if (session.refreshToken) {
          const refreshHeaders: { authorization: string } = {
            authorization: `Bearer ${session.refreshToken}`
          }
          return new Observable((subscriber) => {
            authAPI
              .refresh(refreshHeaders)
              .then(() => {
                if (subscriber.closed) return
                subscriber.next(null)
                subscriber.complete()
              })
              .catch((error) => {
                // NOTE: refreshに失敗した場合にはcookieを破棄
                Cookies.remove('management-assist-session')
                subscriber.error(error)
              })
          }).flatMap(() => {
            operation.setContext(getHeadersWithAuthorization())
            return forward(operation)
          })
        }
      }
    }
  }
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    apolloLink,
    errorLink,
    createUploadLink({
      uri: `${PUBLIC_API_URL}/graphql`,
      headers: {
        'apollo-require-preflight': 'true'
      }
    }) as unknown as ApolloLink
  ])
})

export default apolloClient
