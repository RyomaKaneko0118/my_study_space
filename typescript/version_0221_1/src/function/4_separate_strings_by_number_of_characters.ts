// 指定した文字数で文字列を分ける
export const str = "asdfghjklmnopq";
export const splitPairs: string[] = str.match(/.{6}/g);

console.log(splitPairs); // ['as', 'df', 'gh', 'jk', 'lm', 'no', 'pq']