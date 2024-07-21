class Hoge
  attr_reader :twitter_data

  def initialize
  end

  def icon_url
    twitter_data[:icon_url]
  end

  def location
    twitter_data[:location]
  end

  def twitter_data
    @twitter_data ||= begin
      sleep 10
      { icon_url: "https://hoge.com", location: "Tokyo" }
    end
  end

end

puts "初期化開始"
hoge = Hoge.new
puts "初期化終了"
puts hoge.twitter_data[:icon_url]
puts hoge.twitter_data[:location]
