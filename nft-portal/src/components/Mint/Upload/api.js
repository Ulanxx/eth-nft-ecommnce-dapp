import fetch from '../../../base/fetch'
import { prefix } from '../../../base/constants'

export function uploadToken() {
  return fetch(`${prefix}/upload_token`)
}

