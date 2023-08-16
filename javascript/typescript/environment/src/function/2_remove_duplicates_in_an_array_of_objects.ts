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

console.log("------------- 2 -------------------------")
console.log(uniqueObjects);

console.log("------------- 2_1 -------------------------")
const uniqueObjects2 = Array.from(new Set(arr.map(JSON.stringify as any)))
console.log(uniqueObjects2)