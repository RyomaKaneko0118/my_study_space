module GasOperator
  require 'net/http'
  require "json/add/core"

  URL = "#{ENV["TMP_SERVER_URL"]}/api/v1/gas/callback"
  
  def self.fetch_data
    uri = URI.parse("https://uo0m86cil0.execute-api.ap-northeast-1.amazonaws.com/gas")
    puts "-------------- uri -------------------------"
    Net::HTTP.get_response(uri)
  end
end