"use strict";
exports.__esModule = true;
var obj = {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
};
var iteratedObject = Object.entries(obj);
console.log("------------- 6 -------------------------");
console.log(iteratedObject);
var result = iteratedObject.map(function (_a) {
    var key = _a[0], value = _a[1];
    return "".concat(key, " = ").concat(value);
});
console.log(result); // ['key1 = value1', 'key2 = value2', 'key3 = value3']
iteratedObject.forEach(function (property) {
    console.log(property);
    console.log(property[0]);
    console.log(property[1]);
});
console.log("------------- 6_1 -------------------------");
var result1 = iteratedObject.map(function (key, value) { return "".concat(key, " = ").concat(value); });
console.log(result1);
console.log("------------- 6_2 -------------------------");
var result2 = iteratedObject.map(function (key) { return "".concat(key); });
console.log(result2);
