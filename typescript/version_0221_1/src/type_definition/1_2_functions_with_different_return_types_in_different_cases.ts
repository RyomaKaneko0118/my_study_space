// 場合によって返り値の型が異なる関数
export {}
const get = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key]
}

type Human = {
  name: string
  age: number
}
const Taro: Human = {
  name: "Taro",
  age: 789
}
console.log(get(Taro, "name"))
console.log(get(Taro, "age"))
// エラーになる
// console.log(get(Taro, "hoge"))