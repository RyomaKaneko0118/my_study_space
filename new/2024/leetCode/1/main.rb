
origin_numbers = [87, 48, 24, 36]
target = 60

first_index = 0
second_index = 0
is_continue = true

origin_numbers.length.times do |i|
  origin_numbers.each_with_index do |num, ii|
    if i == ii
      next
    end
    result = origin_numbers[i] + num 
    if target == result
      puts origin_numbers[i]
      puts num
      first_index = i
      second_index = ii
      is_continue = false
      break
    end

    break if !is_continue
  end
end

[first_index, second_index]