import { setLocale } from 'yup'
import * as ja from 'yup-locale-ja'

import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = async () => {
  setLocale(ja.suggestive)
}
