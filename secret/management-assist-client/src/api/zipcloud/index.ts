import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://zipcloud.ibsnet.co.jp',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  search(zipcode: string) {
    return axiosClient.get(`/api/search?zipcode=${zipcode}`)
  }
}
