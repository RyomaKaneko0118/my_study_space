"use strict";
exports.__esModule = true;
exports.splitChars = exports.str = void 0;
// 文字列を同じ文字ごとに分けて配列にする
exports.str = "abbcccdeefghhiijklll";
exports.splitChars = exports.str.match(/(.)\1*/g);
console.log("------------- 5 -------------------------");
console.log(exports.splitChars); // ['a', 'bb', 'ccc', 'd', 'ee', 'f', 'g', 'hh', 'ii', 'j', 'k', 'lll']
