function resolveAfter2Seconds() {
  console.log("starting slow promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("success!! SLOW")
      console.log("slow promise is done");
    }, 10000);
  });
}

function resolveAfter1Second() {
  console.log("starting fast promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("success!! FAST")
      console.log("fast promise is done");
    }, 5000);
  });
}
async function sequentialStart() {
  console.log("==SEQUENTIAL START==");

  // 1. これは即時実行される
  const slow = await resolveAfter2Seconds();
  console.log(slow); // 2. これは 1. の 2 秒後に実行される

  const fast = await resolveAfter1Second();
  console.log(fast); // 3. これは 1. の 3 秒後に実行される
}

async function concurrentStart() {
  console.log("==CONCURRENT START with await==");
  const slow = resolveAfter2Seconds(); // ただちにタイマーを起動
  const fast = resolveAfter1Second(); // ただちにタイマーを起動

  // 1. これは即時実行される
  console.log(await slow); // 2. これは 1. の 2 秒後に実行される
  console.log(await fast); // 3. fast はすでに解決しているので、これは 1. の 2 秒後 (2.の直後) に実行される
}

function concurrentPromise() {
  console.log("==CONCURRENT START with Promise.all==");
  return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(
    (messages) => {
      console.log(messages[0]); // slow
      console.log(messages[1]); // fast
    },
  );
}

async function parallel() {
  console.log("==PARALLEL with await Promise.all==");

  // 2 つの jobs を並列に実行し両方が完了するのを待つ
  await Promise.all([
    (async () => console.log(await resolveAfter2Seconds()))(),
    (async () => console.log(await resolveAfter1Second()))(),
  ]);
}
