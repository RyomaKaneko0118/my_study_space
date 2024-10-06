class Api::V1::SlackController < ApplicationController
  protect_from_forgery except: [:callback]
  require 'net/http'
  require "json/add/core"

  TMP_SERVER_URL = ENV["TMP_SERVER_URL"].freeze
  
  def callback
    notify_to_slack(params[:message])
  end

  def notify_to_slack(message)
    uri = URI.parse(ENV["SLACK_WEBHOOK_URL"])

    slack_text = <<~EOS
      <!here> 会議が始まります。
      担当者は準備をお願いします！

      Zoom会議には以下URLで入れます。
      #{message}
    EOS

    payload = {
      username: "デイリーお知らせbot",
      icon_emoji: ":spiral_calendar_pad",
      text: slack_text
    }.to_json

    Net::HTTP.post_form(uri, { payload: payload })
    render json: true
  end
end
