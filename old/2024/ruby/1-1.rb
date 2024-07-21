class Hoge

  def icon_url
    twitter_data[:icon_url]
  end

  def location
    twitter_data[:location]
  end

  def twitter_data
    @data ||= begin
      sleep 10
      data = { icon_url: "https://hoge.com", location: "Tokyo" }
      data
    end
  end

end

hoge = Hoge.new
puts hoge.icon_url
puts hoge.location
