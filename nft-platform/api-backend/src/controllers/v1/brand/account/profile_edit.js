import constants from "../../../../common/constants";

const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/brand/account/profile_edit'

const schema_request = {
  id: '/brand/account/profile',
  type: 'object',
  additionalProperties: false,
  properties: {
    companyName: {type: 'string', maxLength: 100, "minLength": 1},
    contactName: {type: 'string', maxLength: 50, minLength:1},
    contactEmail: {
      "anyOf": [{type: 'string', maxLength: 50, format: "email"},
        {"type": "string", "enum": [""]}]
    },
    contactPhoneNumber: {type: 'string', maxLength: 30},
    walletAddress: {type: 'string', maxLength: 50}
  },
  required: []
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * code:
 * 0    ---  Brand user profile updated
 * -5   ---  You are NOT a brand user
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
    const result = await logic(user_id, role, body)

    ctx.status = 200

    if (result) {
      ctx.body = {code: 0, message: 'Brand user profile updated', payload: result.new_brand_user}
    }
  }else{
    ctx.status = 401
    ctx.body = {code: -5, message: 'You are NOT a brand user'}
  }
}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = async function (ctx) {
  const validate_result = json_validator.validate(ctx.request.body, schema_request)
  return validate_result.valid
}
