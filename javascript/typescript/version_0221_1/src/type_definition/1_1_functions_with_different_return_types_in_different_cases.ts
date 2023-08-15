// 場合によって返り値の型が異なる関数
export {}
const get = (obj, key) => {
  return obj[key]
}

const Taro = {
  name: "Taro",
  age: 789
}
console.log(get(Taro, "name"))
console.log(get(Taro, "age"))

console.log(get(Taro, "hoge"))
// undefined