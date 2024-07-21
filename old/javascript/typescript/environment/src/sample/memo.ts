export {}
class IsDate {
  isFuture(year: number, month: number, day: number): boolean
  isFuture(date: Date): boolean
  isFuture(isoString: string): boolean
  isFuture(
    ...args:
    | [year: number, month: number, day: number]
    | [date: Date]
    | [isoString: string]
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