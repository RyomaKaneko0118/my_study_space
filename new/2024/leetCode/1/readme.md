## Two Sum
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.

Example 1:

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
Example 2:

Input: nums = [3,2,4], target = 6
Output: [1,2]
Example 3:

Input: nums = [3,3], target = 6
Output: [0,1]
 

Constraints:
2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= target <= 109
Only one valid answer exists.

## 日本語
整数の nums と整数の target の配列が与えられたとき、それらが target に加算されるような2つの数値の添字を返す。
各入力は正確に1つの解を持つと仮定してよく、同じ要素を2度使ってはならない。
答えを返す順番は自由である。

例1：
入力： nums = [2,7,11,15], target = 9
出力 [0,1]
説明 nums[0] + nums[1] == 9なので、[0, 1]を返す。
例 2：

入力： nums = [3,2,4], target = 6
出力： [1,2]
例 3：

入力： nums = [3,3], ターゲット = 6
出力： [0,1]
 

制約
2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= ターゲット <= 109
有効な答えは1つしか存在しない。