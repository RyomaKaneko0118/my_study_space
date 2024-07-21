if ARGV.length == 0
  puts "引数がありません。"
else
  binary_data = ARGV
end

result = binary_data.pack('B*')

puts result
# 参考サイト
# https://speakerdeck.com/ima1zumi/tanosiistring?slide=10