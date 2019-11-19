const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/admin/brand/create'

const schema_request = {
  id: '/admin/brand/create',
  type: 'object',
  additionalProperties: false,
  properties: {
    companyName: {type: 'string', maxLength: 100, "minLength": 1},
    brandName: {type: 'string', maxLength: 100, "minLength": 1},
    contactName: {type: 'string', maxLength: 50},
    contactEmail: {type: 'string', maxLength: 50, format: "email"},
    contactPhoneNumber: {type: 'string', maxLength: 30},
    publicAddress: {type: 'string', maxLength: 100, "minLength": 1}
  },
  required: ["companyName", "publicAddress"]
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * code:
 * 0    ---  new user created successfully
 * -1   ---  already existing
 */

module.exports.action = async function (ctx) {
  const body = ctx.request.body

  /**
   *
   * This is /admin/brand/create routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   */
  let result = await logic(body)

  ctx.status = 200

  if (result) {
    result.id = result._id
    ctx.body = {code: 0, message: 'new brand created', payload: result}
  } else {
    ctx.body = {code: -1, message: 'brand already existing'}
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
