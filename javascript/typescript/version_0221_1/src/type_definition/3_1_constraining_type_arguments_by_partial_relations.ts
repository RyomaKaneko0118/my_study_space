// 部分関係による型引数の制約をする
// extends型はこの型引数は常に型の部分型でなければならないという制約を意味する
export {}
type HasName = {
  name: string
}
type Family<Parent extends HasName, Children> = {
  mother: Parent
  father: Parent
  children: Children
}

// エラーになる
// const obj: Family<number, string> = {
//   mother: 100,
//   father: 471,
//   children: "1000"
// }