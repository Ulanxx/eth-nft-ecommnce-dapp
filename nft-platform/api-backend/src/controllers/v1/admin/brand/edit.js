const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/admin/brand/edit'

const schema_request = {
  id: '/admin/brand/edit',
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {type: 'string', maxLength: 30},
    companyName: {type: 'string', maxLength: 100, "minLength": 1},
    contactName: {type: 'string', maxLength: 50},
    contactEmail: {
      "anyOf": [{type: 'string', maxLength: 50, format: "email"},
        {"type": "string", "enum": [""]}]
    },
    contactPhoneNumber: {type: 'string', maxLength: 30},
    publicAddress: {type: 'string', maxLength: 100}
  },
  required: ["id"]
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * code:
 * 0    ---  brand user updated
 * -3   ---  no such brand user existing
 */

module.exports.action = async function (ctx) {
  const body = ctx.request.body

  /**
   *
   * This is /admin/brand/edit routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   */

  let result = await logic(body)
  ctx.status = 200

  if (result) {
    ctx.body = {code: 0, message: 'brand user updated', payload: result}
  } else {
    ctx.body = {code: -3, message: 'no such brand user existing'}
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
