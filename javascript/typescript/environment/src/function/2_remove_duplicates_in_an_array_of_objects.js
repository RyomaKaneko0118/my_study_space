"use strict";
exports.__esModule = true;
var arr = [{ key: 'value' }, { key2: 'value2' }, { key: 'value' }, { key3: 'value3' }];
var uniqueObjects = Array.from(new Set(arr.map(JSON.stringify))).map(JSON.parse);
console.log("------------- 2 -------------------------");
console.log(uniqueObjects);
console.log("------------- 2_1 -------------------------");
var uniqueObjects2 = Array.from(new Set(arr.map(JSON.stringify)));
console.log(uniqueObjects2);
