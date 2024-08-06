def two_sum(nums, target)
  result = []

  nums.length.times do |i|
    calculate_number = target - nums[i]
    get_index = nums.index(calculate_number)
    if !get_index.nil? && get_index != i 
      result = [i, get_index]
      break
    end
  end
  result
end