const _ = require('underscore');

// constants
const targetMongoUrl = 'mongodb://localhost:27017';
const targetMongoDb = 'miracodb';

// mongo client
var targetMongoClient = null;


/**
 * create a connection if unestablished
 */
var establishTargetMongoClient = function () {
    if (!targetMongoClient) {
        MongoClient.connect(targetMongoUrl, { useNewUrlParser: true }).then(client => {
            if (client) {
                targetMongoClient = client;
                return Promise.resolve(true);
            } else {
                console.log("Error: failed to set mongodb. ${err.message}");
                return Promise.reject(false);
            }
        }).catch(err => {
            console.log("Error: mongodb exception. ${err.message}");
            return Promise.reject(false);
        });
    }

    return Promise.resolve(true);
}

/**
 * update external collections
 * @param {*} data 
 */
var update_target = function (data) {
    establishTargetMongoClient().then(established => {
        targetMongoClient.db(targetMongoDb).collection('transactions').update({ txHash: data.transactionHash }, { $set: { status: 'SUCCESS' } });
        targetMongoClient.db(targetMongoDb).collection('mints').update({ txHash: data.transactionHash }, { $set: { status: 'SUCCESS', to: data.data.to } });
    }).catch(err => {
        console.log("Error: failed to connect to mongodb. ${err.message}");
    });
};

var update = function (mongodb, data) {
    try {
        mongodb.collection('transactions').update({ txHash: data.transactionHash }, { $set: { status: 'SUCCESS', blockHash: data.blockHash, blockNumber: data.blockNumber } });
        mongodb.collection('mints').update({ tokenId: data._tokenId }, { $set: { status: 'IDLE', to: data._to.toLowerCase() } });
    } catch (err) {
    }
};

module.exports = update;
