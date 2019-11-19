const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/admin/brand/list'

const schema_request = {
  id: '/admin/brand/list_request',
  type: 'object',
  additionalProperties: false,
  properties: {

  },
  required: []
}

/**
 * body format:
 * {
 *   conditions:{}
 *   options: {}
 * }
 * both conditions and options are compliant with mongoose Model find method.
 * @param ctx
 * @returns {Promise<void>}
 */
module.exports.action = async function (ctx) {
  const body = ctx.request.body

  /**
   *
   * This is /admin/brand/list routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   */
  let result = await logic(body)

  ctx.status = 200
  ctx.body = {code: 0, message: "brand list retrieved", payload: result}
}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = async function (ctx) {
  const validate_result = json_validator.validate(ctx.request.query, schema_request)
  return validate_result.valid
}
