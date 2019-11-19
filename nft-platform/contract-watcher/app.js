var _ = require("underscore");
var Web3 = require("web3");
var MongoClient = require("mongodb").MongoClient;
var watch = require("./watch.js")
var fs = require('fs');
var ganache = require('ganache-cli');

const PROVIDER_URL = "ws://localhost:8545";
const MONGO_URL = "mongodb://localhost:27017";

var App = function (options) {
    this.options = options;
    this.initialized = false;

    this.web3 = null;
    this.mongodb = null;
    this.watch = watch;
    this.contract = null;
};

App.prototype.init = function () {
    if (this.initialized) {
        return Promise.resolve(true);
    }

    console.log("initializing app...");

    if (this.options === null || !_.isObject(this.options)) {
        console.log("Error: init options should be an object");
        return Promise.reject(false);
    }

    providerUrl = this.options.providerUrl;
    mongoUrl = this.options.mongoUrl;
    mongodbName = this.options.mongodbName;
    contractAddress = this.options.contractAddress;
    abi = this.options.abi;

    if (providerUrl === null) {
        providerUrl = PROVIDER_URL;
        console.log("Warn: provider url is set to ${PROVIDER_URL} by default");
    }

    if (mongoUrl === null) {
        mongoUrl = MONGO_URL;
        console.log("Warn: mongodb url is set to ${MONGO_URL} by default");
    }

    if (mongodbName === null) {
        console.log("Error: db name is not set");
        return Promise.reject(false);
    }

    if (contractAddress === null) {
        console.log("Error: contract address is not set");
        return Promise.reject(false);
    }

    if (abi === null) {
        console.log("Error: abi is not set");
        return Promise.reject(false);
    }

    if (!this._setWeb3(providerUrl)) {
        console.log("Error: failed to set web3");
        return Promise.reject(false);
    }

    if (!this._setContract(abi, contractAddress)) {
        console.log("Error: failed to set contract");
        return Promise.reject(false);
    }

    return this._setMongodb(mongoUrl).then(success => {
        if (success) {
            this.initialized = true;
            return Promise.resolve(true);
        } else {
            return Promise.reject(false);
        }
    });
}

App.prototype._setWeb3 = function (providerUrl) {
    if (!providerUrl) {
        console.log("Error: provider url can not be empty");
        return false;
    } else {
        this.web3 = new Web3();
        this.web3.setProvider(new Web3.providers.WebsocketProvider(providerUrl));
        return true;
    }
}

App.prototype._setContract = function (abi, address) {
    if (!abi || !address) {
        console.log("Error: abi or address is not set");
        return false;
    }

    if (!this.web3) {
        console.log("Error: please set web3 first");
        return false;
    }

    this.contract = new this.web3.eth.Contract(abi, address);

    return true;
}

App.prototype._setMongodb = function (mongoUrl) {
    if (!mongoUrl) {
        console.log("Error: mongo url can not be empty");
        return Promise.reject(new Error("mongo url can not be empty"));
    } else {
        return MongoClient.connect(mongoUrl, { useNewUrlParser: true })
            .then(client => {
                if (client) {
                    this.mongodb = client;
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
};

App.prototype.start = function (options) {
    if (!this.initialized) {
        console.log("Error: app has not be initialized");
        return;
    }

    if (!_.isObject(options)) {
        console.log("Error: strat options should be an object");
        return;
    }

    console.log("starting app...");
    this.watch(this.contract, this.mongodb, options);
    console.log("app running");
};

module.exports = App;