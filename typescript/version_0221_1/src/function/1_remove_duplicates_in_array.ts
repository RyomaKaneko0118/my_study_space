// 配列の重複を除去する

export const arr: string[] = ["a", "b", "c", "d", "d", "c", "e"]
export const uniqueArray = Array.from(new Set(arr));

console.log("------------- 1 -------------------------")
console.log(uniqueArray)