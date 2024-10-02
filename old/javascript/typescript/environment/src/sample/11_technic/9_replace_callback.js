"use strict";
exports.__esModule = true;
// replace コールバック
var string = "a dog went to dig and dug a doggone large hole";
var replacedString = string.replace(/d.g/g, function (str) { return str + "gy"; });
console.log("---------- 9 -------------------");
console.log(replacedString); // a doggy went to diggy and duggy a doggygone large hole
