import constants from "../../../../common/constants"

const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import logic from '../../../../business/user/token/symbol'
import _ from 'lodash'

const schema_request = {
  id: '/brand/token',
  type: 'object',
  additionalProperties: false,
  properties: {
    symbol: {type: 'string', maxLength: 100, minLength: 1},
    name: {type: 'string', maxLength: 100, minLength: 1},
    title: {type: 'string', maxLength: 100},
    url: {type: 'string', maxLength: 255},
    description: {type: 'string', maxLength: 100},
    category: {type: 'string', maxLength: 100, minLength: 1},
    brand: {type: 'string', maxLength: 100, minLength: 1},
    variants: {
      type: 'array',
      items: {
        $ref: '/brand/token/variant'
      },
      minItems: 1
    }
  },
  required: ["symbol", "name", "category", "brand"]
}

const schema_request_variant = {
  id: '/brand/token/variant',
  type: 'object',
  additionalProperties: false,
  properties: {
    variant: {type: 'string', maxLength: 100, minLength: 1},
    sku: {type: 'string', maxLength: 100, minLength: 1},
    price: {type: 'number', multipleOf: 0.01},
    amount: {type: 'integer'},
  },
  required: ["variant", "price", "amount"]
}
json_validator.addSchema(schema_request_variant, schema_request_variant.id)

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
  if (role === constants.USER_ROLE_ENDUSER) {
    /**
     *
     * This is /v1/user/token/symbol routing endpoint
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
  const body = ctx.request.body
  const user_id = ctx.jwt.payload.id
  const role = ctx.jwt.payload.role

  // TODO: check permissions rather than checking role string
  if (role === constants.USER_ROLE_ENDUSER) {
    /**
     *
     * This is /v1/user/token/symbol routing endpoint
     * Task of the endpoint: resolve request and construct response(API protocol layer)
     * DON"T write business logic here!
     */
    const result = await logic(user_id, role, body)

    ctx.status = 200

    if (result && result.symbolVariant) {
      ctx.body = {code: 0, message: 'all enduser related symbols returned', payload: {symbols: result.symbolVariant}}
    } else {
      ctx.body = {code: -11, message: 'no such end user existing'}
    }
  } else {
    ctx.status = 401
    ctx.body = {code: -12, message: 'You are NOT an end user'}
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
  return true
}
