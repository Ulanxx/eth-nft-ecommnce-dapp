import { get } from 'lodash'
import jwtStore from './jwt'

export default function(input, init) {

  const headers = get(init, 'headers')

  return fetch(
    input,
    {
      ...init,
      headers: {
        ...headers,
        Authorization: `Bearer ${jwtStore.value}`
      }
    }
  ).then(
    res => {
      if (res.status === 200) {
        return res.json().then(body => {
          if (body.code === 0) {
            return body.payload
          }
          return Promise.reject({
            code: body.code
          })
        })
      }
      return Promise.reject({
        code: res.status
      })
    }
  )
}
