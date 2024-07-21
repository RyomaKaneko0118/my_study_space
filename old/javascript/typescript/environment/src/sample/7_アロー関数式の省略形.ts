// アロー関数式の省略形
export {}
type Human = {
  height: number
  weight: number
}
const calculateBMI = ({ height, weight }: Human): number => {
  return weight / height ** 2
}

const alice: Human = {
  height: 175,
  weight: 65
}

const calBMI = ({ height, weight }: Human): number => weight / height ** 2

console.log(calculateBMI(alice))
console.log(calBMI(alice))