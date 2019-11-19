import fetch from '../../base/fetch'
import { prefix } from '../../base/constants'

export function getUserByPublicAddress(publicAddress) {
  return fetch(`${prefix}/metamask_user?publicAddress=${publicAddress}`)
}

export function authenticate({ publicAddress, signature }) {
  return fetch(`${prefix}/metamask_auth`, {
    body: JSON.stringify({ publicAddress, signature }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}
