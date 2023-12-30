import axiosClient from '$lib/axios'

const AUTH_PATH = 'auth'

export type SigninData = {
  email: string
  password: string
}

export default {
  signin(data: SigninData) {
    return axiosClient.post(`${AUTH_PATH}/signin`, data)
  },
  refresh(headers: { authorization: string }) {
    return axiosClient.put(`${AUTH_PATH}/refresh`, {}, { headers })
  }
}
