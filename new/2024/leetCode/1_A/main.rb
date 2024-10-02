
# NOTE:
# キーワード引数は不可だった
def two_sum(nums, target)
  first_index = 0
  second_index = 0
  is_continue = true
  
  nums.length.times do |i|
    nums.each_with_index do |num, ii|
      if i == ii
        next
      end
      result = nums[i] + num 
      if target == result
        puts nums[i]
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
end

nums = [87, 48, 24, 36]
target = 60

two_sum(nums, target)