import axios from 'axios'
import 'dotenv/config'

const createAxiosClient = () => {
  return axios.create({
    baseURL: `${process.env.MY_AWS_LAMBDA_URL}`
  })
}

const runMyAWSLambda = () => {
  const client = createAxiosClient()
  const headers = {
    'Content-Type': 'application/json'
  } 
  const response = client.post('', '', { headers })
  return response
}

export const main = async () => {
  console.log('----------------------------------------------------------')
  console.log(`start run`)


  const response = await runMyAWSLambda()
  console.log(response.data)
  console.log(`finished`)
}

main().catch((e) => {
  console.error(e)
  console.error(e.data)
  process.exit(1)
})