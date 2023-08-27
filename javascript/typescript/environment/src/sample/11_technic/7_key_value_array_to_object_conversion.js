"use strict";
exports.__esModule = true;
var entryified = [
    ["key1", "value1"],
    ["key2", "value2"],
    ["key3", "value3"]
];
var originalObject = Object.fromEntries(entryified);
console.log("------------- 7 -------------------------");
console.log(originalObject); // { key1: 'value1', ... }
