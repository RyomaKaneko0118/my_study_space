def message(text)
  puts "------------------------------"
  puts "#{text}"
end

message("3つの配列から一つの配列を作成する")
('a'..'z').to_a
('A'..'Z').to_a
('0'..'9').to_a
[('a'..'z').to_a, ('A'..'Z').to_a, ('0'..'9').to_a]

message("リファクタリング")
pass_list = [('a'..'z'), ('A'..'Z'), ('0'..'9')].map { |i| i.to_a }.flatten

message("配列からランダムに一文字を5回取り出して配列にする")
(1..5).map { pass_list[rand(pass_list.length)] }

message("結合すると疑似パスワードになる")
(1..5).map { pass_list[rand(pass_list.length)] }.join