import { outputMessage } from "../helper/output_message";
import  { increment, getValue } from "./counter";

const text1 = "最初の値は"
outputMessage(text1, getValue())

const text2 = "カウンタの値は"
for (let i = 0; i < 3; i++) {
  outputMessage(text2, increment())
}

const text3 = "最後の値は"
outputMessage(text3, getValue())