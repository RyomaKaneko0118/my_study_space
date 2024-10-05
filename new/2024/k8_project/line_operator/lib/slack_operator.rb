module SlackOperator
  require 'net/http'
  require "json/add/core"

  URL = "#{ENV["TMP_SERVER_URL"]}/api/v1/slack/callback"
  
  def self.fetch_data
    uri = URI.parse(URL)
    puts "-------------- uri -------------------------"
    Net::HTTP.get_response(uri)
  end

  def self.notify(message)
    uri = URI.parse(URL)
    puts "-------------- uri -------------------------"
    Net::HTTP.post_form(uri, { message: message })
  end
end