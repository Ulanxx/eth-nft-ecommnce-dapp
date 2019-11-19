const Validator = require('jsonschema').Validator
import logic from '../../business/metamask_user'

module.exports.action = async function (ctx) {
  const body = ctx.request.body

  /**
   *
   * This is /metamask_user routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   * GET /metamask_user?publicAddress=
   */
  let result = await logic(ctx.request.query.publicAddress)

  ctx.status = 200
  ctx.body = {code:0, payload:{nonce: result, publicAddress: ctx.request.query.publicAddress}}
}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = async function (ctx) {
  return !!ctx.request.query.publicAddress
}
