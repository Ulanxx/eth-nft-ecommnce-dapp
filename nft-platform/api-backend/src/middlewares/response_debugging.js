'use strict'

const defaults_options = {

}

module.exports = function (opts) {
  let _opts = {}
  Object.assign(_opts, defaults_options, opts)

  return async (ctx, next) => {
    let body = ctx.body || ''
    if (typeof body === 'object'){
      body = JSON.stringify(body)
    }
    logger.debug(`[${ctx._session_id_debugging}]response debugging: \n status_code: ${ctx.status} \n body: ${body} `)
    return next()
  }
}
