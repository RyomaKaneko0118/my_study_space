const eventAEmitter = new events.EventEmitter()
const eventAIterable = events.on(eventAEmitter, 'eventA')
console.log("イベントが一つ登録されていることを確認")
eventAEmitter.listeners("eventA")
console.log("即時関数")
(async () => {
  for await (const a of eventAIterable) {
    if (a[0] === "end") {
      break
    }
    console.log("eventA", a)
  }
})()
eventAEmitter.emit("eventA", "hello")
eventAEmitter.emit("eventA", "hello world")
eventAEmitter.emit("eventA", "end")
eventAEmitter.listeners("eventA")