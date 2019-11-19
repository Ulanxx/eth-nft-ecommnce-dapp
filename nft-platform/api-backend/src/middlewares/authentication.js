const _ = require('lodash')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const defaults_options = {
  token_auto_expire: 3600,  // in seconds
  nonce_expiration: 3600,    // in seconds
  jwt_secret: 'whateversecret'
}

/**
 * @return {boolean}
 */
const DEFAULT_REVOKE_ASSERTION = function (dtoken_payload) {
  const DEFAULT_EXPIRATION_TIME = 3600 * 24 * 7
  const now_epoch = moment().valueOf() / 1000
  return dtoken_payload.iat + DEFAULT_EXPIRATION_TIME <= now_epoch
}

function get_header_authorization(ctx) {
  if (!ctx.header || !ctx.header.authorization) {
    return
  }

  const parts = ctx.header.authorization.split(' ')

  if (parts.length === 2) {
    const scheme = parts[0]
    const credentials = parts[1]

    if (/^Bearer$/i.test(scheme)) {
      return credentials
    } else {
      ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"')
    }
  }
}

function verify_jwt(...args) {
  return new Promise((resolve, reject) => {
    jwt.verify(...args, (error, decoded) => {
      error ? reject(error) : resolve(decoded)
    })
  })
}

module.exports = function (opts) {
  let _opts = {
    revoke_assertion: DEFAULT_REVOKE_ASSERTION
  }
  Object.assign(_opts, defaults_options, opts)

  const secret = _opts.jwt_secret

  if (!secret) {
    throw new Error('JWT Secret not configured!')
  }

  return async (ctx, next) => {
    const path = ctx.request.path
    const method = ctx.method

    // for some api endpoints, skipping the authentication
    /*
    let skip = _.find(opts.routes, {"authentication": false, "method": method, "path": path})
    if (skip) {
      return next()
    }
    */

    let need_to_authenticate = _.find(opts.routes, {'authentication': true, 'method': method, 'path': path})

    if (need_to_authenticate) {
      // authentication, JWT
      try {
        const token = get_header_authorization(ctx)

        if (token) {
          const verified = await verify_jwt(token, secret)
          if (verified) {
            const dtoken = jwt.decode(token, {complete: true}) || {}

            const is_revoked = _opts.revoke_assertion(dtoken.payload)
            if (!is_revoked) {
              ctx.jwt = {
                payload: dtoken.payload
              }
              logger.debug(`JWT: ${JSON.stringify(dtoken.payload)}`)
              return next()
            }else{
              logger.warn(`jwt expired ${JSON.stringify(dtoken.payload)}`)
            }
          }else{
            logger.warn(`jwt can't be verified ${ctx.path}`)
          }
        }else{
          logger.warn(`no jwt header content set for requesting ${ctx.path}`)
        }
      } catch (err) {
        global.logger.error(err)
      }

      ctx.status = 401
    }
    return next()
  }
}
