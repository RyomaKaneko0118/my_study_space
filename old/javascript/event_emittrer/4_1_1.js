function copyFileWithStream(src, dest, cb) {
  readStream().pipe(fs.createWriteStream(dest)).on("finish", cb)

  function readStream() {
    const readStream = fs.createReadStream(src)
    readStream.on("readable", () => {
      console.log("readable")
      let chunk
      while((chunk = readStream.read()) !== null) {
        console.log(`chunk: ${chunk.toString()}`)}
    })
    return readStream
  }
}
const src = "/Users/bou/workspace/git_clone/my_study_space/javascript/event_emittrer/test.txt"
const dest = "/Users/bou/workspace/git_clone/my_study_space/javascript/event_emittrer/test_test.txt"
function finish() {
  console.log("終了")
}
console.log(`全ての内容を読み込んでから書き出すのではなく、
読み込みながら書き出す`)
copyFileWithStream(src, dest, finish)