class Api::V1::LineBotController < ApplicationController
  protect_from_forgery except: [:callback]
  require 'net/http'
  require "json/add/core"
  
  TMP_SERVER_URL = ENV["TMP_SERVER_URL"].freeze

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
          res = fetch_daily_person
          puts "-------------- daily_person -------------------------"
          puts res
          message = JSON.parse(res.body)
          notify_to_slack(event.message['text'] + message["message"])
          # notify_to_slack(event.message['text'] + res.body.gsub('"', ''))

          message = {
            type: 'text',
            text: "slackに通知しました"
          }
          client.reply_message(event['replyToken'], message)
        end
      end
    end
    head :ok
  end

  def hello
    render json: { message: "hello" }
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

  def fetch_daily_person
    uri = URI.parse("#{ENV["TMP_SERVER_URL"]}/api/v1/gas/callback")
    puts "-------------- uri -------------------------"
    Net::HTTP.get_response(uri)
  end

  def notify_to_slack(message)
    uri = URI.parse("#{ENV["TMP_SERVER_URL"]}/api/v1/slack/callback")
    puts "-------------- uri -------------------------"
    Net::HTTP.post_form(uri, { message: message })
  end
end
