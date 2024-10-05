class LineBotController < ApplicationController
  protect_from_forgery except: [:callback]
  require 'net/http'
  require "json/add/core"
  
  def callback
    body = request.body.read
    signature = request.env['HTTP_X_LINE_SIGNATURE']
    unless client.validate_signature(body, signature)
      return head :bad_request
    end

    events = client.parse_events_from(body)
    events.each do |event|
      case event
      when Line::Bot::Event::Message
        case event.type
        when Line::Bot::Event::MessageType::Text
          daily_person = fetch_daily_person(ENV["SPREAD_SHEET_URL"])
          message = {
            type: 'text',
            text: event.message['text'] + daily_person
          }
          client.reply_message(event['replyToken'], message)
        end
      end
    end
    head :ok
  end

  private
  
  def client
    @client ||= Line::Bot::Client.new { |config|
      config.channel_secret = ENV["LINE_CHANNEL_SECRET"]
      config.channel_token = ENV["LINE_CHANNEL_TOKEN"]
    }
  end

  def zoom
    path = "https://api.zoom.us/v2/users/{userId}/meetings"
    uri = URI.parse(path)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    payload = {
      topic: "デイリー",
      type: "1",
      duration: "40",
      timezone: "Asia/Tokyo",
      password: "",
      agenda: "進捗報告"
    }.to_json
    
    headers = {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer 2owtufITT_-uws-DEdBi-Q}"
    }
    
    req = Net::HTTP::Post.new(uri.path)
    req.body = payload
    
    req.initialize_http_header(headers)
    res = http.request(req)
    puts res.body
  end

  def fetch_daily_person(uri)
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
    when Net::HTTPFound
      puts "-------------- first -------------------------"
      fetch_daily_person(res["location"])
    end
  end
end
