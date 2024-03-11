import { main } from './post_slack_webhook'

export const handler = async (event, context) => {
  await main()
}

handler()