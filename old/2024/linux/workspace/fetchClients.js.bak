import axios from 'axios'
import 'dotenv/config'

const createAxiosClient = () => {
  return axios.create({
    baseURL: `${process.env.TARGET_URL}`
    // headers: {
    //   Authorization: `Bearer ${process.env.BOARD_API_TOKEN}`,
    //   'x-api-key': process.env.BOARD_API_KEY
    // }
  })
}

const fetchClients = () => {
  const client = createAxiosClient()
  const response = client.get('')
  return response
}

const main = async () => {
  console.log('----------------------------------------------------------')
  console.log(`start fetch`)
  const response = await fetchClients()
  console.log(response.data)
  console.log(`fetched`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

