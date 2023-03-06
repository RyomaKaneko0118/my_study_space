// 型引数を持つ型
export {}
type Family<Parent, Children> = {
  mother: Parent
  father: Parent
  children: Children
}

const obj: Family<number, string> = {
  mother: 100,
  father: 471,
  children: "1000"
}