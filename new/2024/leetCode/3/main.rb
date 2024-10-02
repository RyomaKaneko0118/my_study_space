# I             1
# V             5
# X             10
# L             50
# C             100
# D             500
# M             1000

# NOTE
# 大文字が使えない
def roman_to_int(s)
  regex =  /\A[IVXLCDM]+\z/
  conversion_table = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  }

  if !s.match(regex)
    puts "Invalid input"
    return
  end

  result = 0
  conversioned_chars = s.chars.map { |char| conversion_table[char.to_sym] }
  conversioned_chars.each_with_index do |n, i|

    if conversioned_chars[i + 1].nil?
      result += n
      break
    end

    if n >= conversioned_chars[i + 1]
      result += n
    else
      result -= n
    end
  end
  result
end

