// 文字列を同じ文字ごとに分ける
export const str = "abbcccdeefghhiijklll";
export const splitChars: string[] = str.match(/(.)\1*/g);

console.log(splitChars); // ['a', 'bb', 'ccc', 'd', 'ee', 'f', 'g', 'hh', 'ii', 'j', 'k', 'lll']