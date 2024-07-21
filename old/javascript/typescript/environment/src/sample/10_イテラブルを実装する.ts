// #イテラブルを実装
export {}
class RangeIterator {
  current: number
  last: number

  constructor(current: number, last: number) {
    this.current = current,
    this.last = last
  }

  next(): { value: number } | { done: boolean } {
    if (this.current < this.last) {
      const result = { value: this.current}
      this.current++
      return result
    } else {
      return { done: true }
    }
  }
}

class Range {
  start: number
  end: number
  constructor(start, end) {
    this.start = start
    this.end = end
  }

  [Symbol.iterator]() {
    return new RangeIterator(this.start, this.end)
  }
}

const arry = new Range(1, 100)
console.log(arry)
for (const element of arry as any) console.log(element)
for (const key in arry ) console.log(key)
