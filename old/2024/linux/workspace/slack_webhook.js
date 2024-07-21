import axios from 'axios'
import 'dotenv/config'

const createAxiosClient = () => {
  return axios.create({
    baseURL: `${process.env.WEBHOOK_URL}`
  })
}

const postSlackWebHook = (payload) => {
  const client = createAxiosClient()
  const headers = {
    'Content-Type': 'application/json'
  } 
  const response = client.post('', payload, { headers })
  return response
}

const main = async () => {
  console.log('----------------------------------------------------------')
  console.log(`start fetch`)

  const join_url = 'https://zoom.us/j/123456789'
  const text = `
  <!here> 会議が始まります。
  担当者は準備をお願いします！

  Zoom会議には以下URLで入れます。
  ${join_url}
`
  const payload = JSON.stringify({
  username: "デイリーお知らせbot",
  icon_emoji: ":spiral_calendar_pad",
  channel: "#random",
  text
})

  const response = await postSlackWebHook(payload)
  console.log(response.data)
  console.log(`fetched`)
}

main().catch((e) => {
  console.error(e)
  console.error(e.data)
  process.exit(1)
})

