import axiosClient from '$lib/axios'

export default {
  contractFile({
    id,
    headers
  }: {
    id: number
    headers: { authorization: string }
  }) {
    return axiosClient.get(`file/contracts/${id}/file`, {
      headers,
      responseType: 'blob'
    })
  },
  lecturersCsv(headers: { authorization: string }) {
    return axiosClient.get('file/lecturers/csv', {
      headers,
      responseType: 'blob'
    })
  }
}
