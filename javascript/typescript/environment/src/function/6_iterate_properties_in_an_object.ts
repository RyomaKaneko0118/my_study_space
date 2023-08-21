// オブジェクト内のプロパティをイテレートする
export {}

const obj = {
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
const iteratedObject = Object.entries(obj)
const result = iteratedObject.map(([key, value]) => `${key} = ${value}`)
console.log(result)
console.log(iteratedObject)

iteratedObject.forEach((property) => {
  console.log(property)
})

const result1 = iteratedObject.map((key, value) => `${key} = ${value}`)
console.log(result1)
const result2 = iteratedObject.map((key) => `${key}`)
console.log(result2)