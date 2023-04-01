// 指定した文字数で文字列を分けて、配列にする
export const str = "asdfghjklmnopq";
export const splitPairs: string[] = str.match(/.{2}/g);
console.log("------------- 4 -------------------------")
console.log(splitPairs); // ['as', 'df', 'gh', 'jk', 'lm', 'no', 'pq']