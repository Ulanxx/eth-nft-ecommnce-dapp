import fetch from '../../base/fetch'
import { prefix } from '../../base/constants'
import { formatUrl } from '../../base/utils'

export function listTokens(batchId) {
  return fetch(`${prefix}/brand/token/inventory?${formatUrl({batchId})}`)
}
