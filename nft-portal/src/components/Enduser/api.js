import fetch from '../../base/fetch'
import { prefix } from '../../base/constants'

export function listSymbols() {
  return fetch(`${prefix}/user/token/symbol`)
}

export function listTokens() {
  return fetch(`${prefix}/user/token/inventory`)
}


export function transfer(dataSigned) {
  return fetch(`${prefix}/user/token/transaction`, {
    body: JSON.stringify({dataSigned}),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

export function transferMark(contractAddress, tokenId, to, transactionHash) {
  return fetch(`${prefix}/user/token/transaction_demo`, {
    body: JSON.stringify({
      contractAddress,
      tokenId,
      toAddress: to,
      txHash: transactionHash
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

export function listTransferHistory() {
  return fetch(`${prefix}/user/token/transaction`)
}

export function verification(uniqueSig) {
  return fetch(`${prefix}/user/token/verification?uniqueSig=${uniqueSig}`)
}

