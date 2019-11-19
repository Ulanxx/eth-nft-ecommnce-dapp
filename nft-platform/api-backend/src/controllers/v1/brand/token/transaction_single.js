import constants from "../../../../common/constants";

const Validator = require('jsonschema').Validator
const json_validator = new Validator()
import transfer_logic from '../../../../business/brand/token/transaction.js'
import issue_history_logic from '../../../../business/brand/token/issue_history'
import _ from 'lodash'

const schema_request = {
  id: '/brand/token',
  type: 'object',
  additionalProperties: false,
  properties: {
    contractAddress: {type: 'string', maxLength: 100, minLength: 1},
    tokenId: {type: 'string', maxLength: 100, minLength: 1},
    to: {type: 'string', maxLength: 100},
  },
  required: ["contractAddress", "tokenId", "to"]
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
    const result = await transfer_logic(user_id, role, body)

    ctx.status = 200

    if (result) {
      ctx.body = {code: 0, message: 'transfer request accepted', payload: {}} // TODO: fill in the payload with result content
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
  if (role === constants.USER_ROLE_BRAND) {
    /**
     *
     * This is /brand/account/billing_list routing endpoint
     * Task of the endpoint: resolve request and construct response(API protocol layer)
     * DON"T write business logic here!
     */
    const result = await issue_history_logic(user_id, role, body)

    ctx.status = 200

    if (result && result.history) {
      const batchList = result.history.batchList
      const symbolVariants = result.history.symbolVariants
      const search_variant = (id) => {
        for (let sv of symbolVariants) {
          const variant = _.find(sv.variants, (v) => {
            return v._id.toString() === id
          })
          if (variant) {
            const result = _.cloneDeep(variant)
            result.symbol = sv.symbol
            result.name = sv.name
            result.description = sv.description
            result.category = sv.category
            result.brand = sv.brand
            return result
          }
        }
      }
      for (let b of batchList) {
        for (let v of b.batch) {
          const variantInfo = search_variant(v.variantId.toString())
          v.symbol = variantInfo.symbol
          v.name = variantInfo.name
          v.description = variantInfo.description
          v.category = variantInfo.category
          v.brand = variantInfo.brand
          v.price = variantInfo.price
          v.variant = variantInfo.variant
          v.sku = variantInfo.sku
        }
      }
      ctx.body = {code: 0, message: 'brand account token mint histories returned', payload: result.history}
    } else {
      ctx.body = {code: -2, message: 'no such branding user'}
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
module.exports.validation.POST = async function (ctx) {
  const validate_result = json_validator.validate(ctx.request.body, schema_request)
  return validate_result.valid
}
