"use strict";
exports.__esModule = true;
exports.splitPairs = exports.str = void 0;
// 指定した文字数で文字列を分けて、配列にする
exports.str = "asdfghjklmnopq";
exports.splitPairs = exports.str.match(/.{2}/g);
console.log("------------- 4 -------------------------");
console.log(exports.splitPairs); // ['as', 'df', 'gh', 'jk', 'lm', 'no', 'pq']
