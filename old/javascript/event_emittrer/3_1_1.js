function copyFile(src, dest, cb) {
  fs.readFile(src, (err, data) => {
    if (err) {
      return cb(err)
    }
    fs.writeFile(dest, data, cb)
  })
}
const src = "/Users/bou/workspace/git_clone/my_study_space/javascript/event_emittrer/test.txt"
const dest = "/Users/bou/workspace/git_clone/my_study_space/javascript/event_emittrer/test_test.txt"
const cb = (e) => {
  console.log(e)
}
copyFile(src, dest, cb)