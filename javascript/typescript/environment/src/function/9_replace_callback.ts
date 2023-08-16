export {}
// replace コールバック
const string = "a dog went to dig and dug a doggone large hole";
const replacedString = string.replace(/d.g/g, str => str + "gy")
console.log("---------- 9 -------------------")
console.log(replacedString); // a doggy went to diggy and duggy a doggygone large hole
