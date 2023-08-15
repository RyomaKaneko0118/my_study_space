export {}
class IsDate {
  isFutureDate(year: number, month: number, day: number): boolean;
  isFutureDate(date: Date): boolean;
  isFutureDate(isoDateString: string): boolean;
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
console.log(new IsDate().isFutureDate("2022-08-31"))
