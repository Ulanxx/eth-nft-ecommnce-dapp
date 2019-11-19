import fetch from '../../base/fetch'
import { prefix } from '../../base/constants'

export function listTokens() {
  return fetch(`${prefix}/brand/token/issue`)
}

export function transfer({ to, variantId, amount }) {
  return fetch(`${prefix}/brand/token/transaction`, {
    method: 'POST',
    body: JSON.stringify({
      to, variantId, amount
    })
  })
}

export function transferSingle({ to, tokenId, contractAddress }) {
  return fetch(`${prefix}/brand/token/transaction_single`, {
    method: 'POST',
    body: JSON.stringify({
      contractAddress,
      to,
      tokenId
    })
  })
}
