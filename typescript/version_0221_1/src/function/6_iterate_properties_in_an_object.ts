// オブジェクト内のプロパティをイテレートする
export {}

const obj = {
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
const iteratedObject = Object.entries(obj)
console.log(iteratedObject)
const result = iteratedObject.map(([key, value]) => `${key} = ${value}`)

console.log(result)// ['key1 = value1', 'key2 = value2', 'key3 = value3']

iteratedObject.forEach((property) => {
  console.log(property)
  console.log(property[0])
  console.log(property[1])
})