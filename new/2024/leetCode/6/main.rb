def merge_two_lists(list1, list2)
  return list2 if list1.nil?
  return list1 if list2.nil?

  if list1.val < list2.val
    list1.next = merge_two_lists(list1.next, list2)
    list1
  else
    list2.next = merge_two_lists(list1, list2.next)
    list2
  end
end