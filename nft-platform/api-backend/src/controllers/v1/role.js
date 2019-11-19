const Validator = require('jsonschema').Validator
const json_validator = new Validator()

module.exports.action = async function (ctx) {
  const body = ctx.request.body
  const user_id = ctx.jwt.payload.id
  const role = ctx.jwt.payload.role

  /**
   *
   * This is /metamask_auth routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   */

  ctx.status = 200
  ctx.body = {code: 0, message: '', payload: {role: role}}
}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = async function (ctx) {
  return true
}
