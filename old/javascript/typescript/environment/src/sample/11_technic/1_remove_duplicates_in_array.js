"use strict";
// 配列の重複を除去する
exports.__esModule = true;
exports.uniqueArray = exports.arr = void 0;
exports.arr = ["a", "b", "c", "d", "d", "c", "e"];
exports.uniqueArray = Array.from(new Set(exports.arr));
console.log("------------- 1 -------------------------");
console.log(exports.uniqueArray);
console.log("------------- 1_2 -------------------------");
console.log(new Set(exports.arr));
