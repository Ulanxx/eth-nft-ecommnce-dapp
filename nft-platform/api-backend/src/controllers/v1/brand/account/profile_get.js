import constants from "../../../../common/constants";

const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/brand/account/profile_get'

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * code:
 * 0    ---  brand user profile
 * -5   --- you are NOT a brand user
 */

module.exports.action = async function (ctx) {
  const body = ctx.request.body
  const user_id = ctx.jwt.payload.id
  const role = ctx.jwt.payload.role

  // TODO: check permissions rather than checking role string
  if (role === constants.USER_ROLE_BRAND) {
    /**
     *
     * This is /admin/brand/create routing endpoint
     * Task of the endpoint: resolve request and construct response(API protocol layer)
     * DON"T write business logic here!
     */
    const result = await logic(user_id, role)

    ctx.status = 200

    if (result) {
      ctx.body = {code: 0, message: 'brand user profile', payload: result}
    }
  }else{
    ctx.status = 401
    ctx.body = {code: -5, message: 'you are NOT a brand user'}
  }
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
