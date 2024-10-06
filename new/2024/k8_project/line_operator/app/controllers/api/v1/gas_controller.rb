class Api::V1::GasController < ApplicationController
  protect_from_forgery except: [:callback]
  require 'net/http'
  require "json/add/core"

  TMP_SERVER_URL = ENV["TMP_SERVER_URL"].freeze
  
  def callback
    puts "-------------- Gas callback -------------------------"
    fetch_data(ENV["SPREAD_SHEET_URL"])
  end

  def fetch_data(uri)
    uri = URI.parse(uri)
    http = Net::HTTP.new(uri.hostname, uri.port)
    puts "-------------- request uri -------------------------"
    puts uri.request_uri
    req = Net::HTTP::Get.new(uri.request_uri)
    http.use_ssl = true
    res = http.request(req)
    case res
    when Net::HTTPOK
      puts "-------------- second -------------------------"
      puts res
      puts res.body
      res.body.force_encoding("UTF-8")
      message = JSON.parse(res.body)
      puts message
      render json: { message: message }
    when Net::HTTPFound
      puts "-------------- first -------------------------"
      fetch_data(res["location"])
    end
  end
end
