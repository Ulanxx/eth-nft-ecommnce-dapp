const log4js = require('log4js')
const path = require('path')

// log4js init
log4js.configure(path.join(process.cwd(), 'config', 'log4js.json'))

const logger = log4js.getLogger()
let logger_debug
if (process.env.NODE_ENV === 'development') {
  logger_debug = log4js.getLogger('debug')
}else{
  logger_debug = {
    all: function(){},
    trace: function(){},
    debug: function(){},
    info: function(){},
    warn: function(){},
    error: function(){},
    fatal: function(){},
    mark: function(){}
  }
}
global.logger = logger
global.logger_debug = logger_debug

export {logger, logger_debug}

