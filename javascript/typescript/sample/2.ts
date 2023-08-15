// ユニオン型とインターセクション型の表裏一体の関係
export {}
type Human = { name: string}
type Animal = { age: number}

function getName(human: Human) {
  return human.name
}
function getSpecies(animal: Animal) {
  return animal.age
}

const randomFunction = Math.random() < 0.5 ? getName : getSpecies
const sample: Human & Animal = {
  name: "taro",
  age: 145
}
const result = randomFunction(sample) 
console.log(result)