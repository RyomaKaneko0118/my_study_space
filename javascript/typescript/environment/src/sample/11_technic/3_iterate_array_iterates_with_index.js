"use strict";
exports.__esModule = true;
exports.letterPositions = exports.arr = void 0;
// index付きの配列のイテレート
exports.arr = ['a', 'b', 'c'];
exports.letterPositions = exports.arr.map(function (char, index) { return "".concat(char, " is at index ").concat(index); });
console.log("------------- 3 -------------------------");
console.log(exports.letterPositions);
