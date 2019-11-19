import { get } from 'lodash'
import JWT from 'jsonwebtoken'

function jwt_creation(payload = {}) {
  return new Promise((resolve, reject) =>
    JWT.sign(
      payload,
      'whateversecret',
      null,
      (err, token) => {
        if (err) {
          return reject(err)
        }
        return resolve(token)
      }
    )
  )
}


export default function(input, init) {
  return jwt_creation().then(
    token => {
      const headers = get(init, 'headers')
      return fetch(
        input,
        {
          ...init,
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`
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
  )
}


