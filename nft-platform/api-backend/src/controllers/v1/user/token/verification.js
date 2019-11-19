import constants from "../../../../common/constants";

const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import issue_logic from '../../../../business/brand/token/issue'
import verification_logic from '../../../../business/user/token/verification'
import _ from 'lodash'

const schema_request = {
  id: '/user/token',
  type: 'object',
  additionalProperties: false,
  properties: {
    tokenId: {type: 'string', maxLength: 100, minLength: 1},
    uniqueSig: {type: 'string', maxLength: 100},
  },
  required: ["uniqueSig"]
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
 * code:
 * -9    ---  You are NOT a valid token holder
 */
module.exports.action.GET = async function (ctx) {
  const body = ctx.request.query
  const user_id = ctx.jwt.payload.id
  const role = ctx.jwt.payload.role

  // TODO: check permissions rather than checking role string
  if (role === constants.USER_ROLE_BRAND ||
    role === constants.USER_ROLE_ENDUSER) {
    /**
     *
     * This is /brand/account/billing_list routing endpoint
     * Task of the endpoint: resolve request and construct response(API protocol layer)
     * DON"T write business logic here!
     */
    const result = await verification_logic(user_id, role, body)

    ctx.status = 200

    if (result.verification) {
      ctx.body = {code: 0, message: '', payload: {verification: true, productDetail: result.productDetail}}
    } else {
      ctx.body = {code: 0, message: '', payload: {verification: false}}
    }

  } else {
    ctx.status = 401
    ctx.body = {code: -9, message: 'You are NOT a valid token holder'}
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
