/**
 * created by lujun at 2018-09-25 14:03
 */
let _APP_NAME = global.APP_NAME || 'APP_NAME'

logger.info(`------------- ${_APP_NAME} starts -------------`)

const signal_handler = function(){
  logger.info ('SIGINT received, exiting....')
  logger.info(`------------- ${_APP_NAME} ends -------------`)
  process.exit()
}

const exit_process = function(code){
  //logger.info (`process exiting with code= ${code}`)

}
process.on('SIGINT', signal_handler)
process.on('exit', exit_process)
