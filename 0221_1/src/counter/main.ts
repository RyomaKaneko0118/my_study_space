import  { increment } from "./counter";

for (let i = 0; i < 3; i++) {
  console.log(`カウンタの値は${increment()}です。`)
}
