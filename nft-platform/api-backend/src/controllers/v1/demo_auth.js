const Validator = require('jsonschema').Validator
const json_validator = new Validator()

module.exports.action = async function (ctx) {
  ctx.status = 200
  ctx.body = {}
}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = async function (ctx) {
  return true
}
