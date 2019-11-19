const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../business/metamask_auth'

const schema_request = {
  id: '/metamask_auth',
  type: 'object',
  properties: {
    publicAddress: {type: 'string'},
    signature: {type: 'string'}
  },
  required: ['publicAddress', 'signature']
}

module.exports.action = async function (ctx) {
  const body = ctx.request.body

  /**
   *
   * This is /metamask_auth routing endpoint
   * Task of the endpoint: resolve request and construct response(API protocol layer)
   * DON"T write business logic here!
   */
  try{
    let result = await logic(body.publicAddress, body.signature)
    if (!result){
      ctx.status = 401
    }else{
      ctx.status = 200
      ctx.body = {code:0, payload:{jwt: result}}
    }
  }catch(err){
    // request format is OK, but contents could not be calculated/processed
    logger.error(err)
    ctx.status = 422
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
