/**
 * created by lujun at 2018-09-25 14:03
 */
import { logger, log4js } from './lib/log';
import Server from './lib/server';

global.APP_NAME = 'Ether-worker';

class App {
  static run() {
    require('./lib/signal');
    const server = new Server('ether_tasks');

    server.on('init', () => {
      server.start();
    });
  }
}
App.run();
process.on('unhandledRejection', (reason, p) => {
  logger.error(reason, p);
});
process.on('uncaughtException', err => {
  logger.error(err);
});

// process.on('SIGUSR2',() => {
//   const heapdump = require('heapdump')
//   if (global.gc){
//     global.gc()
//   }
//   heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot')
// })
