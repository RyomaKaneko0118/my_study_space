import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('What is your name? ', (name: string) => {
  console.log(`Hello, ${name}!`)
  rl.close()
})