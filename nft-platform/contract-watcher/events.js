const abi = require('web3-eth-abi');
const utils = require('./utils.js.js.js');

// event hashes
var eventHashes = [
  utils.sha3('Transfer(address,address,uint256)'),
  utils.sha3('IssuerAdded(uint256,string,string)'),
  utils.sha3('IssuerRemoved(uint256)'),
  utils.sha3('AuthorizedAddress(address,bool)'),
  utils.sha3('Approval(address,bool)'),
  utils.sha3('ApprovalForAll(address)'),
  utils.sha3('Pause()'),
  utils.sha3('Unpause()'),
  utils.sha3('Whitelisted(address)'),
  utils.sha3('Unwhitelisted(address)')
];

// events
var events = [
  'Transfer',
  'IssuerAdded',
  'IssuerRemoved',
  'AuthorizedAddress',
  'Approval',
  'ApprovalForAll',
  'Pause',
  'Unpause',
  'Whitelisted',
  'Unwhitelisted'
];

// mapping event id to collection and inputs
var eventMapping = [
  {
    name: 'Transfer',
    collName: 'transfer',
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        name: '_tokenId',
        type: 'uint256'
      }
    ]
  },
  {
    name: 'IssuerAdded',
    collName: 'issuer',
    inputs: [
      {
        indexed: false,
        name: '_issuerId',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_name',
        type: 'string'
      },
      {
        indexed: false,
        name: '_symbol',
        type: 'string'
      }
    ]
  },
  {
    name: 'IssuerRemoved',
    collName: 'issuer',
    inputs: [
      {
        indexed: false,
        name: '_issueId',
        type: 'uint256'
      }
    ]
  },
  {
    name: 'AuthorizedAddress',
    collName: 'authorize',
    inputs: [
      {
        indexed: true,
        name: '_target',
        type: 'address'
      },
      {
        indexed: false,
        name: '_authorized',
        type: 'bool'
      }
    ]
  },
  {
    name: 'Approval',
    collName: 'approval',
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address'
      },
      {
        indexed: true,
        name: '_approved',
        type: 'address'
      },
      {
        indexed: true,
        name: '_tokenId',
        type: 'uint256'
      }
    ]
  },
  {
    name: 'ApprovalForAll',
    collName: 'approval',
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address'
      },
      {
        indexed: true,
        name: '_operator',
        type: 'address'
      },
      {
        indexed: false,
        name: '_approved',
        type: 'bool'
      }
    ]
  },
  { name: 'Pause', collName: 'admin_operation', inputs: [] },
  { name: 'Unpause', collName: 'admin_operation', inputs: [] },
  {
    name: 'Whitelisted',
    collName: 'whitelist',
    inputs: [
      {
        indexed: true,
        name: '_target',
        type: 'address'
      }
    ]
  },
  {
    name: 'Unwhitelisted',
    collName: 'whitelist',
    inputs: [
      {
        indexed: true,
        name: '_target',
        type: 'address'
      }
    ]
  }
];
/**
 * @dev logHandler
 * @notice make sure that the log parameter is a log object
 */
var logHandler = function(log) {
  // new log
  let newLog = log;

  // get return values
  let returnValues = log.returnValues;
  let keys = Object.keys(returnValues);

  // extract parameters
  let i = 0;
  for (var key in returnValues) {
    if (i < keys.length / 2) {
      i++;
    } else {
      newLog[key] = returnValues[key];
    }
  }

  return refactorLog(newLog);
};

// refactor log
var refactorLog = function(newLog) {
  delete newLog.id;
  delete newLog.returnValues;
  delete newLog.signature;
  delete newLog.raw;

  return newLog;
};

/**
 * @dev logHandler
 * @notice make sure that the log parameter is a log object
 */
var logHandler2 = function(log) {
  // get the signature
  let eventSignature = log.topics[0];
  let topics = log.topics.filter(function(element) {
    return element != eventSignature;
  });
  let data = log.data === '0x' ? '' : log.data;

  // get the event index
  let index = eventHashes.findIndex(function(value, index, arr) {
    return value == eventSignature;
  });

  // get the log data
  if (index > -1) {
    let eventName = eventMapping[index].name;
    let inputs = eventMapping[index].inputs;

    let logData = abi.decodeLog(inputs, data, topics);

    for (var key in logData) {
      if (parseInt(key) < logData.__length__) {
        delete logData[key];
      }
    }

    delete logData.__length__;

    return refactorLog(log, eventName, logData);
  } else {
    return null;
  }
};

// refactor log
var refactorLog2 = function(originLog, eventName, logData) {
  delete originLog.topics;
  delete originLog.data;
  delete originLog.id;

  originLog.event = eventName;
  originLog.data = logData;

  return originLog;
};

// get the collection of an event
var getEventCollection = function(eventName) {
  let index = events.findIndex(function(value, index, arr) {
    return value == eventName;
  });

  if (index > -1) {
    return eventMapping[index].collName;
  } else {
    return null;
  }
};

// event documents
var buildDocument = function(event, log) {
  switch (event) {
    case 'Transfer':
    case 'IssuerAdded':
    case 'IssuerRemoved':
    case 'Approval':
    case 'ApprovalForAll':

    default:
      return null;
  }
};

module.exports = {
  logHandler: logHandler,
  getEventCollection: getEventCollection,
  buildDocument: buildDocument
};
