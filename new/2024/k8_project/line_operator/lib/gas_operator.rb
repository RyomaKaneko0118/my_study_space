module GasOperator
  require 'net/http'
  require "json/add/core"

  URL = "#{ENV["TMP_SERVER_URL"]}/api/v1/gas/callback"
  
  def self.fetch_data
    uri = URI.parse(URL)
    puts "-------------- uri -------------------------"
    Net::HTTP.get_response(uri)
  end
end