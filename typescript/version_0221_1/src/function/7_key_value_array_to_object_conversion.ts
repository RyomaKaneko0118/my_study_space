export {}
const entryified = [
  ["key1", "value1"],
  ["key2", "value2"],
  ["key3", "value3"]
];

const originalObject = Object.fromEntries(entryified);

console.log(originalObject); // { key1: 'value1', ... }