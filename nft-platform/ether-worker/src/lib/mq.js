/**
 * created by lujun at 2018-09-25 14:03
 */
import EventEmitter from 'events';

const stompit = require('stompit');
const bluebird = require('bluebird');
import Commons from './../utils/commons';

const connectionManager = new stompit.ConnectFailover();

bluebird.promisifyAll(stompit.Client.prototype);
bluebird.promisifyAll(stompit.Channel.prototype);
bluebird.promisifyAll(stompit.IncomingFrameStream.prototype);

export default class Mq extends EventEmitter {
  constructor() {
    super();
    this._channel = null;
    this.init();
  }

  init() {
    const mqConfig = Commons.getConfig('config').mq;

    connectionManager.addServer(mqConfig);
    this._channel = new stompit.Channel(connectionManager);
  }

  subscribe(h, callback) {
    console.log(h, callback);
    this._channel.subscribe(h, callback);
  }

  ack(message) {
    console.log(message);
    return this._channel.ack(message);
  }

  async sendAsync(header, body) {
    return await this._channel.sendAsync(header, JSON.stringify(body));
  }
}
