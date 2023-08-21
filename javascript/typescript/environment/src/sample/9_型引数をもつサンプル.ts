// 型引数の例
export {}
type TypeArgument<a, b> = {
  1: a
  2: a
  3: b
}

const sample: TypeArgument<string, number> = {
  1: "1",
  2: "2",
  3: 3
}