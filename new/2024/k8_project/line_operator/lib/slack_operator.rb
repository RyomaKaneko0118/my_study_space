module SlackOperator
  require 'net/http'
  require "json/add/core"

  URL = "#{ENV["TMP_SERVER_URL"]}/api/v1/slack/callback"
  
  def self.notify(message)
    uri = URI.parse("https://f7r8ygeiqb.execute-api.ap-northeast-1.amazonaws.com/slack")
    puts "-------------- uri -------------------------"
    Net::HTTP.post_form(uri, { message: message })
  end
end