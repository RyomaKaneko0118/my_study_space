import { outputMessage } from "../helper/output_message"
import  { increment } from "./counter"

const text = "Alice: カウンタの値は"
outputMessage(text, increment())