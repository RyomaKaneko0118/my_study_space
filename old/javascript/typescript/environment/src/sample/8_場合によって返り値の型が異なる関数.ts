export {}
const get = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key] 
type Human = {
  name: string
  age: number
}
const alice: Human = {
  name: "alice",
  age: 245
}

console.log(get(alice, "age"))