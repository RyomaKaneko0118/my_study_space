// index付きの配列のイテレート
export const arr: string[] = ['a', 'b', 'c'];
export const letterPositions = arr.map(
  (char, index) => `${char} is at index ${index}`
)

console.log(letterPositions)