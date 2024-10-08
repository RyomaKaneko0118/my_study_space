const message :string = 'Hello, World!'

console.log(message)

const member = {
  name: 'Taro',
  age: 20
}

console.log(`
オブジェクトのプロパティ一覧を表示
----------------------------`)
Object.getOwnPropertyDescriptors
Object.getOwnPropertyDescriptors(member)
Object.getOwnPropertyDescriptors(Object)

const hoge = () => {
  const age = 20
  return age * 100
}

Object.getOwnPropertyDescriptors(hoge)
Object.getOwnPropertyDescriptors(hoge())

Object.getPrototypeOf(hoge)
Object.getPrototypeOf(hoge())
Object.getPrototypeOf(Object)
Object.getPrototypeOf(member)


const foo = new Object()
foo.name = 'Taro'
foo.age = 100
Object.getPrototypeOf(foo)
const tmp_obj = Object.create(null)
Object.getPrototypeOf(tmp_obj)

type PersonType = {
  name: string
  age: number
}
class Person  {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}
const person = new Person('Taro', 20)
Object.getPrototypeOf(person)