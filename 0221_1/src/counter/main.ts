import { outputMessage } from "../helper/output_message";
import  { getValue, increment } from "./counter";

const text1 = "カウンタの値は"

for (let i = 0; i < 3; i++) {
  outputMessage(text1, increment())
}
