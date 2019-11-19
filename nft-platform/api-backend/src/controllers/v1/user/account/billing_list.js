import constants from '../../../../common/constants'

const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/user/account/billing_list'

const schema_request = {
  id: '/brand/account/billing_list',
  type: 'object',
  additionalProperties: false,
  properties: {
    startTime: { type: 'string', format: 'date-time' },
    endTime: { type: 'string', format: 'date-time' },
  },
  required: []
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * code:
 * 0    ---  brand account billing list returned
 * -8   ---  no billing for account other than brand role
 * -3   ---  no such branding user
 */

module.exports.action = async function(ctx) {
  const body = ctx.request.body
  const user_id = ctx.jwt.payload.id
  const role = ctx.jwt.payload.role

  // TODO: check permissions rather than checking role string
  if (role === constants.USER_ROLE_BRAND) {
    /**
     *
     * This is /brand/account/billing_list routing endpoint
     * Task of the endpoint: resolve request and construct response(API protocol layer)
     * DON"T write business logic here!
     */
    const result = await logic(user_id, role, body)

    ctx.status = 200

    if (result && result.bills) {
      ctx.body = { code: 0, message: 'brand account billing list returned', payload: result.bills }
    } else {
      ctx.body = { code: -3, message: 'no such branding user' }
    }

  } else {
    ctx.status = 401
    ctx.body = { code: -8, message: 'no billing for account type other than brand role' }
  }

}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = async function(ctx) {
  const validate_result = json_validator.validate(ctx.request.body, schema_request)
  return validate_result.valid
}
