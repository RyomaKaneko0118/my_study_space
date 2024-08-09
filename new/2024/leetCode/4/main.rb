# @param {String[]} strs
# @return {String}
def longest_common_prefix(strs)
  prefix = strs[0]
  target_str = strs.shift
  target_str.each do |str|
    while str.index(prefix) != 0
      prefix = prefix[0...-1]
      break if prefix.empty?
    end
    break if prefix.empty?
  end 
  prefix
end