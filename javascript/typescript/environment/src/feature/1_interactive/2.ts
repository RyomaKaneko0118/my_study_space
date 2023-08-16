export {}
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

process.stdout.write('Countdown: 10');

let count = 10;

setInterval(() => {
  readline.cursorTo(process.stdout, 10);
  process.stdout.write(`${count--}`);
  if (count === 0) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write('\n');
    rl.close();
  }
}, 1000);
