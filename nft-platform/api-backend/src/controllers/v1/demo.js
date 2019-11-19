const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import demo_logic from '../../business/demo'

const schema_request = {
  id: '/demo_request',
  type: 'object',
  properties: {
    param1: {type: 'string', maxLength: 5},
    param2: {type: 'string', 'pattern': '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$'}
  },
  required: ['param1', 'param2']
}
module.exports.action = {}
module.exports.action.POST = async function (ctx) {
  const body = ctx.request.body

  /**
   *
   * This is a demo routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   */
  let result = await demo_logic(body.param1, body.param2)

  ctx.status = 200
  ctx.body = {result: result}
}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = {}
module.exports.validation.POST = async function (ctx) {
  const validate_result = json_validator.validate(ctx.request.body, schema_request)
  return validate_result.valid
}
