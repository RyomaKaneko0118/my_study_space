import axios from 'axios'
import Cookies from 'js-cookie'

import { PUBLIC_API_URL } from '$env/static/public'

const axiosClient = axios.create({
  baseURL: PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.request.use(
  (request) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    if (
      'access-token' in response.headers &&
      'refresh-token' in response.headers
    ) {
      const authHeaders = {
        accessToken: response.headers['access-token'],
        refreshToken: response.headers['refresh-token']
      }

      Cookies.set(
        'management-assist-session',
        encodeURIComponent(JSON.stringify(authHeaders)),
        {
          expires: 30,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'Lax'
        }
      )
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosClient
