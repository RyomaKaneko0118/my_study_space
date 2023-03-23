export {}
const entryified = [
  ["key1", "value1"],
  ["key2", "value2"],
  ["key3", "value3"]
];

const originalObject: object[] = Object.fromEntries(entryified)

console.log("------------- 7 -------------------------")
console.log(originalObject); // { key1: 'value1', ... }