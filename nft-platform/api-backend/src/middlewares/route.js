'use strict'

const _ = require('lodash')
const Path = require('path')
const pathToRegex = require('path-to-regexp')
import {ErrorStatusCode} from '../common/utils'

const defaults_options = {}

/**
 * routing as configured
 * before routing:
 *  1. do validation for this endpoint, if failed, http response status 400, no detailed reason provided
 * if the precondition is satisfied, call controller action.
 * @param opts
 * @returns {function(*=, *): *}
 */

module.exports = function (opts) {
  let _opts = {}
  Object.assign(_opts, defaults_options, opts)

  return async (ctx, next) => {
    if (ctx.status >= 200 && ctx.status !== 404) {

    } else {
      const path = ctx.request.path
      const method = ctx.method
      let m
      let keys = []
      // looking for the routes
      if (_opts.routes) {
        const routes = _opts.routes
        const route_found = _.find(routes, (p) => {
          const method_matched = (p.method === method)
          const path_regex = pathToRegex(p.path, keys)
          m = path_regex.exec(path)
          return !!m && method_matched
        })
        if (route_found && m) {
          // find file
          let file_path = m[0]

          m.slice(1).map(decode).forEach((param) => {
            file_path = file_path.replace(`/${param}`, '')
          })
          const action_path = Path.join('../controllers', file_path)
          // require file
          try {
            const route = require(action_path)
            ctx.path_resolved = m
            if (route.validation) {
              let validation_func
              if ( (typeof route.validation[method]) === 'function' ){
                validation_func = route.validation[method]
              }else if ( (typeof route.validation) === 'function' ){
                validation_func = route.validation
              }else{
                // defaults to no need to validate
                validation_func = (ctx) => {return true}
              }

              if (!await validation_func(ctx)) {
                ctx.status = 400
                logger.warn(`[controller validation failed]400 bad request: ${JSON.stringify(ctx.request.body)}`)
              } else if (route.action) {
                if ( (typeof route.action[method]) === 'function' ){
                  await route.action[method](ctx)
                }else if ( (typeof route.action) === 'function' ){
                  await route.action(ctx)
                }else{
                  throw new Error('controller code is not finished')
                }
              }
            } else if (typeof route === 'function') {
              await route(ctx)
            }
          } catch (err) {
            if (err instanceof ErrorStatusCode) {
              ctx.status = err.status
              ctx.body = {
                code: err.code,
                message: err.message
              }
            } else {
              //logger.error(err.message)
              logger.error(err.stack)
              ctx.status = 500
            }
          }
        }
      }
    }
    return next()
  }
}

function decode(val) {
  if (val) return decodeURIComponent(val)
}
