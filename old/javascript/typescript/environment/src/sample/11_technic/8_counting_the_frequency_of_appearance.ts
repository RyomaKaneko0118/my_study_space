export {}
// 出現頻度をカウントする
const occurrences: string[] = ["a", "b", "c", "c", "d", "a", "a", "e", "f", "e", "f", "g", "f", "f", "f"];
// 同じ文字を一度以上カウントしないようにユニークな配列を作成
const unique = Array.from(new Set(occurrences));

const occurrenceCount = Object.fromEntries(
  unique.map(char => {
    const occurrenceCount = occurrences.filter(c => c === char).length;
    return [char, occurrenceCount]
  })
)
