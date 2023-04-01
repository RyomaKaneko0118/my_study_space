// 文字列を同じ文字ごとに分けて配列にする
export const str = "abbcccdeefghhiijklll";
export const splitChars: string[] = str.match(/(.)\1*/g);
console.log("------------- 5 -------------------------")
console.log(splitChars); // ['a', 'bb', 'ccc', 'd', 'ee', 'f', 'g', 'hh', 'ii', 'j', 'k', 'lll']