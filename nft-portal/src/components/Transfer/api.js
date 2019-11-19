import fetch from '../../base/fetch'
import { prefix } from '../../base/constants'
import { formatUrl } from '../../base/utils'

export function listSymbols() {
  return fetch(`${prefix}/brand/token/symbol`)
}

export function listTransferHistory(query) {
  return fetch(`${prefix}/brand/token/transaction?${formatUrl(query)}`)
}
