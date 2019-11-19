import constants from "../../../../common/constants"

const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/brand/token/inventory'
import _ from 'lodash'

const schema_request = {
  id: '/brand/token/inventory',
  type: 'object',
  additionalProperties: false,
  properties: {
    batchId: {type: 'string', maxLength: 100, minLength: 1},
  },
  required: []
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * code:
 * 0    ---  mint request accepted
 * -6   ---  no enough balance in your account, please deposit.
 * -7   ---  no permission to mint token
 */
module.exports.action = {}
module.exports.action.POST = async function (ctx) {
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
    const result = await issue_logic(user_id, role, body)

    ctx.status = 200

    if (result) {
      ctx.body = {code: 0, message: 'mint request accepted', payload: {}} // TODO: fill in the payload with result content
    } else {
      ctx.body = {code: -6, message: 'no enough balance in your account, please deposit.'}
    }

  } else {
    ctx.status = 401
    ctx.body = {code: -7, message: 'no permission to mint token'}
  }
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
module.exports.action.GET = async function (ctx) {
  const body = ctx.request.query
  const user_id = ctx.jwt.payload.id
  const role = ctx.jwt.payload.role

  // TODO: check permissions rather than checking role string
  if (role === constants.USER_ROLE_BRAND) {
    /**
     *
     * This is /brand/token/inventory routing endpoint
     * Task of the endpoint: resolve request and construct response(API protocol layer)
     * DON"T write business logic here!
     */
    const result = await logic(user_id, role, body)

    ctx.status = 200

    if (result && result.variants) {
      ctx.body = {code: 0, message: 'all tokens issued by brand returned', payload: {variants: result.variants}}
    } else {
      ctx.body = {code: -2, message: 'no such branding user existing'}
    }
  } else {
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
module.exports.validation = {}
module.exports.validation.GET = async function (ctx) {
  const validate_result = json_validator.validate(ctx.request.query, schema_request)
  return validate_result.valid
}
