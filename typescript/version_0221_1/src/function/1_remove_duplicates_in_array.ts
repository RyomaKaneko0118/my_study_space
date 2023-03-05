// 配列の重複を除去する

const arr: string[] = ["a", "b", "c", "d", "d", "c", "e"]
const uniqueArray = Array.from(new Set(arr));

console.log(uniqueArray)