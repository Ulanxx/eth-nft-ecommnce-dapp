import {random} from '../common/utils'

const defaults_options = {}

module.exports = function (opts) {
  let _opts = {}
  Object.assign(_opts, defaults_options, opts)

  return async (ctx, next) => {
    ctx._session_id_debugging = random(100000,500000)
    logger.debug(`[${ctx._session_id_debugging}]request debugging: \n ${ctx.method} ${ctx.request.path}${ctx.request.search}`)
    if (ctx.request.rawBody){
      logger.debug(`${ctx.request.rawBody}`)
    }

    return next()
  }
}
