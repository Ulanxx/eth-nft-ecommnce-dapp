import fetch from '../../base/fetch'
import { prefix } from '../../base/constants'


export function mint(token) {
  return fetch(`${prefix}/brand/token/issue`, {
    body: JSON.stringify(token),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

