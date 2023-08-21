// オブジェクトの配列の重複を削除
export {}
type ObjectKey = {
    key: string
}
const arr = [{ key: 'value' }, { key2: 'value2' }, { key: 'value' }, { key3: 'value3' }];
const uniqueObjects = Array.from(
  new Set(
    arr.map(JSON.stringify as any)
  )
).map(JSON.parse as any)

console.log((uniqueObjects))
console.log(arr.map(JSON.stringify as any))
console.log(new Set(arr.map(JSON.stringify as any)))
console.log(Array.from(new Set(arr.map(JSON.stringify as any))))