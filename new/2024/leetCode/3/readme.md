## Roman to Integer
Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
For example, 2 is written as II in Roman numeral, just two ones added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

I can be placed before V (5) and X (10) to make 4 and 9. 
X can be placed before L (50) and C (100) to make 40 and 90. 
C can be placed before D (500) and M (1000) to make 400 and 900.
Given a roman numeral, convert it to an integer.

 

Example 1:

Input: s = "III"
Output: 3
Explanation: III = 3.
Example 2:

Input: s = "LVIII"
Output: 58
Explanation: L = 50, V= 5, III = 3.
Example 3:

Input: s = "MCMXCIV"
Output: 1994
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.

## ローマ数字から整数へ
ローマ数字は7種類の記号で表される： I、V、X、L、C、D、M。

記号 値
I 1
V 5
X 10
L 50
C 100
D 500
M 1000
例えば、2はローマ数字でIIと書き、2つの1を足しただけである。12はXIIと書き、これは単にX＋IIである。27はXXVIIと書き、これはXX＋V＋IIである。

ローマ数字は通常、左から右に大きいものから小さいものへと書く。しかし、4を表す数字はIIIIではない。代わりに4はIVと書く。1が5の前にあるので、それを引くと4となる。同じ原理が数字の9にも当てはまり、IXと書く。引き算が使われる例は6つある：

IをV（5）とX（10）の前に置くと4と9になる。
XをL（50）とC（100）の前に置くと、40と90になる。
CをD（500）とM（1000）の前に置くと、400と900になる。
ローマ数字が与えられたら、それを整数に変換しなさい。

例1：

入力： s = "III"
出力： 3
説明 III = 3.
例 2：

入力： s = "LVIII"
出力： 58
説明 L = 50, V = 5, III = 3.
例 3：

入力： s = "MCMXCIV"
出力： 1994
説明 M = 1000、CM = 900、XC = 90、IV = 4。

DeepL.com（無料版）で翻訳しました。