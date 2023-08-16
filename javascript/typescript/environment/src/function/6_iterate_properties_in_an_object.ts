// オブジェクト内のプロパティをイテレートする
export {}

const obj = {
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
const iteratedObject = Object.entries(obj)
console.log("------------- 6 -------------------------")
console.log(iteratedObject)
const result = iteratedObject.map(([key, value]) => `${key} = ${value}`)

console.log(result)// ['key1 = value1', 'key2 = value2', 'key3 = value3']

iteratedObject.forEach((property) => {
  console.log(property)
  console.log(property[0])
  console.log(property[1])
})

console.log("------------- 6_1 -------------------------")
const result1 = iteratedObject.map((key, value) => `${key} = ${value}`)
console.log(result1)
console.log("------------- 6_2 -------------------------")
const result2 = iteratedObject.map((key) => `${key}`)
console.log(result2)