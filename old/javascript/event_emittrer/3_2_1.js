function copyFileWithStream(src, dest, cb) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dest)).on("finish", cb)
}
const src = "/Users/bou/workspace/git_clone/my_study_space/javascript/event_emittrer/test.txt"
const dest = "/Users/bou/workspace/git_clone/my_study_space/javascript/event_emittrer/test_test.txt"
function finish() {
  console.log("終了")
}
console.log(`全ての内容を読み込んでから書き出すのではなく、
読み込みながら書き出す`)
copyFileWithStream(src, dest, finish)