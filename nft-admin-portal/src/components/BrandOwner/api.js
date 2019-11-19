import fetch from '../../base/fetch'
import { prefix } from '../../base/constants'

export function createIssuer(companyName, publicAddress) {
  return fetch(`${prefix}/brand/create`, {
    body: JSON.stringify({companyName, publicAddress}),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

export function listIssuer() {
  return fetch(`${prefix}/brand/list`)
}

export function delIssuer(id) {
  return fetch(`${prefix}/brand/delete/${id}`, {
    method: 'DELETE'
  })
}

export function updateIssuer(issuer) {
  return fetch(`${prefix}/brand/edit`, {
    body: JSON.stringify(issuer),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT'
  })
}
