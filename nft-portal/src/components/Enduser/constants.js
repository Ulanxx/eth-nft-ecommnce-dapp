// const Miraco = new web3.eth.Contract(abi, contractAddress, { gas: defaultGas, gasPrice: defaultGasPrice });

// // build contract tx
// var txObject = Miraco.methods.transferFrom(from, to, tokenId);
// console.log(txObject);


export const gas = 10000000
export const gasPrice = 1000000000

export const status = {
  IDLE: 'IDLE',
  TRANSFERRING: 'TRANSFERRING'
}

export const transferStatus = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  TRANSFERRING: 'TRANSFERRING',
  TRANSFERIN: 'IN',
  TRANSFEROUT: 'OUT',
}

export const transferProgressStatus = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  TRANSFERRING: 'TRANSFERRING',
}

export const transferProgressStatusMapColor = {
  [transferProgressStatus.SUCCESS]: 'green',
  [transferProgressStatus.FAILURE]: 'red',
  [transferProgressStatus.TRANSFERRING]: 'orange',
}

export const transferProgressStatusMapText = {
  [transferProgressStatus.SUCCESS]: 'Success',
  [transferProgressStatus.FAILURE]: 'Fail',
  [transferProgressStatus.TRANSFERRING]: 'Transferring',
}

export const transferStatusMapColor = {
  [transferStatus.SUCCESS]: 'green',
  [transferStatus.FAILURE]: 'red',
  [transferStatus.TRANSFERRING]: 'orange',
  [transferStatus.TRANSFERIN]: 'green',
  [transferStatus.TRANSFEROUT]: 'orange',
}

export const transferStatusMapText = {
  [transferStatus.SUCCESS]: 'Success',
  [transferStatus.FAILURE]: 'Fail',
  [transferStatus.TRANSFERRING]: 'Transferring',
  [transferStatus.TRANSFERIN]: 'IN',
  [transferStatus.TRANSFEROUT]: 'OUT',
}

export const tabKeys = {
  overview: 'overview',
  transfer: 'transfer',
  history: 'history'
}

export const tabs = [
  { title: 'Overview', key: tabKeys.overview },
  { title: 'Transfer', key: tabKeys.transfer },
  { title: 'History', key: tabKeys.history },
]


