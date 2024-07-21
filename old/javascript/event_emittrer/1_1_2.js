function createFizzBuzzEventEmitter(until) {
  const eventEmitter = new events.EventEmitter()
  _emitFizzBuzz(eventEmitter, until)
  return eventEmitter
}

async function _emitFizzBuzz(eventEmitter, until) {
  eventEmitter.emit("start")
  let count = 1
  while (count <= until) {
    await new Promise( resolve => setTimeout(resolve, 100))
    if (count % 15 === 0) {
      eventEmitter.emit("FizzBuzz", count)
    } else if (count % 3 === 0) {
      eventEmitter.emit("Fizz", count)
    } else if (count % 5 === 0) {
      eventEmitter.emit("Buzz", count)
    }
    count += 1
  }
  eventEmitter.emit("end")
}

function startListener() {
  console.log("start")
}
function fizzListener(count) {
  console.log("Fizz", count)
}
function buzzListener(count) {
  console.log("Buzz", count)
}
function fizzBuzzListener(count) {
  console.log("FizzBuzz", count)
}
function endListener() {
  console.log("end")
  this.off("start", startListener).off("Fizz", fizzListener).off("Buzz", buzzListener).off("FizzBuzz", fizzBuzzListener).off("end", endListener)
}
createFizzBuzzEventEmitter(40).on("start", startListener).on("Fizz", fizzListener).once("Buzz", buzzListener).on("FizzBuzz", fizzBuzzListener).on("end", endListener)
console.log(`_emitFizzBuzzメソッドは、
指定した数値までカウントを1から1つずつ、
0.1秒間隔でカウントアップしていき、
15で割れる数値の場合、FizzBuzzイベントを実行、
3で割れる数値の場合、Fizzイベントを実行、
5で割れる数値の場合、Buzzイベントを実行する
ただし、Buzzイベントは1回限りとする`)
console.log("Buzzイベントのみonceで登録")
console.log("start及びendイベントが実行されないのはなぜ？")
