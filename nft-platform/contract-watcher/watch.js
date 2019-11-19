var _ = require('underscore');
var Web3 = require('web3');
var MongoClient = require('mongodb').MongoClient;
var utils = require('./utils.js.js.js');
var Event = require('./events.js.js.js');
var update = require('./update.js.js.js');
var Config = require('./config.js.js.js');
var sleep = require('sleep-promise');

const zeroAddress = '0x0000000000000000000000000000000000000000';

var checkArgs = function() {
  args = Array.prototype.slice.call(arguments);
  if (args.length != 3) {
    console.log('Error: the arg count of watch is not correct');
    return false;
  }

  if (!args[0]) {
    console.log('Error: the first arg of watch is null');
    return false;
  }

  if (!args[1] instanceof MongoClient) {
    console.log(
      'Error: the second arg of watch is not an instance of the MongoClient object'
    );
    return false;
  }

  if (!_.isObject(args[2])) {
    console.log('Error:the third arg of watch should be an object');
    return false;
  }

  //handleTopics(args[2].topics);

  return true;
};

var handleTopics = function(topics) {
  if (topics && _.isArray(topics)) {
    topics = topics.map(function(topic) {
      return topic.indexOf('0x') == 0 ? topic : utils.padZero(topic, 64);
    });
  }
};

/**
 * write data to mongodb
 *
 * @param {MongoClient} mongodb MongoClient instance
 * @param {String} dbName db name to which to write data
 * @param {String} collName collection name to which to write data
 * @param {Object | Array} data data to write to mongodb
 * @notice assume that mongodb is a connected MongoClient object
 */
var write = function(mongodb, dbName, collName, data) {
  if ((!_.isObject(data) && !_.isArray(data)) || _.isEmpty(data)) {
    return;
  }

  if (_.isObject(data)) {
    mongodb
      .db(dbName)
      .collection(collName)
      .insertOne(data);
  } else {
    mongodb
      .db(dbName)
      .collection(collName)
      .insertMany(data);
  }
};

// watch
var watch = function(contract, mongodb, options) {
  if (!checkArgs(contract, mongodb, options)) {
    return;
  }

  // start to watch
  contract.events
    .allEvents()
    .on('data', function(event) {
      // parse event
      let parsedLog = Event.logHandler(event);

      if (parsedLog !== null) {
        console.log('log received:' + parsedLog.event);

        // get the collection name
        let collName = Event.getEventCollection(parsedLog.event);

        // write to db
        write(mongodb, Config.mongodbName, collName, parsedLog);

        // update if the event is 'Transfer'
        if (
          Config.update &&
          parsedLog.event == 'Transfer' &&
          parsedLog._from !== zeroAddress
        ) {
          sleep(20000).then(() => {
            // TODO: to change policy later
            update(mongodb.db(Config.mongodbName), parsedLog);
          });
        }
      }
    })
    .on('error', function(err) {
      console.log(err);
    });
};

module.exports = watch;
