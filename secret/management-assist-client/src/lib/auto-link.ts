const REG_EXP_URL =
  /(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%_#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+)/gi

export function autoLink(value?: string) {
  if (!value) return ''
  return value.replace(
    REG_EXP_URL,
    "<a href='$1' target='_blank' class='text-link'>$1</a>"
  )
}
