// 引数にタプルを使ってオーバーロード関数の可読性を高くする
// https://qiita.com/suin/items/2653fea448fd6246437a
export {}
class IsDate {
  isFutureDate(year: number, month: number, day: number): boolean
  isFutureDate(date: Date): boolean
  // '05 October 2011 14:48 UTC'
  isFutureDate(isoDateString: string): boolean
  isFutureDate(
    ...args:
    | [year: number, month: number, day: number]
    | [date: Date]
    | [isoDateString: string]
    ): boolean {
      if (args.length === 3) {
        const [year, month, day] = args
        return new Date(year, month, day) > new Date()
      }
      const dateOrString = args[0]
      if (dateOrString instanceof Date) {
        return dateOrString > new Date()
      }
      return new Date(dateOrString) > new Date()
    }
}

console.log(new Date())
console.log(new IsDate().isFutureDate('05 October 2023 14:48 UTC'))
