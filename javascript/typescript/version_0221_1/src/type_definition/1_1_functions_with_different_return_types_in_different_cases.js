"use strict";
exports.__esModule = true;
var get = function (obj, key) {
    return obj[key];
};
var Taro = {
    name: "Taro",
    age: 789
};
console.log(get(Taro, "name"));
console.log(get(Taro, "age"));
console.log(get(Taro, "hoge"));
// undefined
