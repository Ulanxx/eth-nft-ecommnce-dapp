const signal_handler = function(){
  global.logger.info ('SIGINT received, exiting....')
  global.logger.info(`------------- ${global.APP_NAME} ends -------------`)
  process.exit()
}

const exit_process = function(code){
  //logger.info (`process exiting with code= ${code}`)

}
process.on('SIGINT', signal_handler)
process.on('exit', exit_process)
