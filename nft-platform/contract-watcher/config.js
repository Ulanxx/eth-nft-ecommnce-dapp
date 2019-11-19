// config

const interface = require('./abi.js.js');

var config = {
  providerUrl: 'ws://localhost:34567',
  mongoUrl: 'mongodb://localhost:27017',
  mongodbName: 'miracodb',
  contractAddress: '0x82fc08ec23e3e6ec08772bef743b74fec27cb38f',
  abi: interface,
  update: true
};

module.exports = config;
