const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/admin/brand/delete'

// const schema_request = {
//   id: '/admin/brand/delete',
//   type: 'object',
//   properties: {
//     id: {type: 'string', maxLength: 30}
//   },
//   required: ["id"]
// }

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * code:
 * 0    ---  brand deleted successfully
 * -2   ---  no such brand existing
 */

module.exports.action = async function (ctx) {
  const body = ctx.request.body
  const id = ctx.path_resolved[1]

  /**
   *
   * This is /admin/brand/delete routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   */
  let result = await logic(id)

  ctx.status = 200

  if (result) {
    ctx.body = {code: 0, message: 'brand deactivated successfully'}
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
  return (ctx.path_resolved.length === 2) && !!ctx.path_resolved[1]
}
