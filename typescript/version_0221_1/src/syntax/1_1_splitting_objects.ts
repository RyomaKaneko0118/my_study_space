export {}
type Config = {
  separator: string
  leftDeliminator?: string
  rightDeliminator?: string 
} 
let config: Config = { separator: ';'}
const { separator = ',', leftDeliminator = '[', rightDeliminator = ']' }  = config
console.log("--------------------------------------------------")
console.log(separator)
console.log("--------------------------------------------------")