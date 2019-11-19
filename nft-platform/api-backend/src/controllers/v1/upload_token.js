import logic from "../../business/upload_token";

const Validator = require('jsonschema').Validator
const json_validator = new Validator()

module.exports.action = async function (ctx) {
    const body = ctx.request.body

    let result = await logic();
    ctx.status = 200
    ctx.body = {code: 0, message: '', payload: result};
}

/**
 * Do simple request parameters validation
 * for json schema, simply refers to https://json-schema.org
 * @param ctx
 * @returns {Promise<boolean>}
 */
module.exports.validation = async function (ctx) {
    return true
};