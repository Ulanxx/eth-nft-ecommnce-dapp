/**
 * created by lujun at 2018-09-25 14:03
 */
const Web3 = require('web3')
const contract = require('truffle-contract')
const uuid = require('uuid/v4')
const ethlib = require('eth-lib')

import fs from 'fs-plus'
import path from 'path'
import https from 'https'
import EventEmitter from 'events'
import _ from 'lodash'
import moment from 'moment'
import Mq from './mq'
import Redis from './redis'
import Commons from './../utils/commons'
import Constants from '../utils/constants'
import sleep from 'sleep-promise'

const bluebird = require('bluebird')
const proofHash = Commons.calculateHash

const provider_ip = Commons.getConfig('config').blockchain.provider.ip
const provider_port = Commons.getConfig('config').blockchain.provider.port

const blockchain_node_endpoint = `http://${provider_ip}:${provider_port}`
logger.info(`Web3 RPC Provider: ${blockchain_node_endpoint}`)

const web3 = new Web3()
web3.setProvider(new Web3.providers.HttpProvider(blockchain_node_endpoint))

const interfaceDir = path.join(
  process.cwd(),
  '..',
  'build',
  'contracts',
  'MiracoCore.json'
)

// get abi
const interface_json = JSON.parse(fs.readFileSync(interfaceDir))
const miracoAbi = interface_json.abi
const contract_address = Commons.getConfig(
  'config'
).blockchain.contractAddress.toLowerCase()
const contract_owner = Commons.getConfig(
  'config'
).blockchain.contractOwnerAddress.toLowerCase()
const defaultGas = Commons.getConfig('config').blockchain.defaultGas
const gasPrice = Commons.getConfig('config').blockchain.gasPrice
const singleMintCountMax = 5

const Miraco = new web3.eth.Contract(miracoAbi, contract_address, {
  from: contract_owner,
  gas: defaultGas,
  gasPrice: gasPrice
})

const mint_receipt_queue_header = {
  destination: 'tasks_callback',
  ack: 'client-individual'
}

export default class Server extends EventEmitter {
  constructor(queue_ether_tasks) {
    super()
    this.mq = new Mq()
    this.running = false
    this._queue_name = queue_ether_tasks
    this._commands = {}
    this._init()
  }

  async _init() {
    this._commands['TOKEN_ISSUE'] = this.onMintToken
    this._commands['TOKEN_TRANSFER'] = this.onTokenTransfer
    this._commands['TOKEN_TRANSFER_RAW'] = this.onTransactionSigned
    const subscribeHeaders = {
      destination: this._queue_name,
      ack: 'client-individual'
    }

    this.mq.subscribe(subscribeHeaders, async (err, message) => {
      if (err) {
        logger.error(err)
      } else {
        await this.onTask(message)
      }
    })
    logger.info('server init')
    this.emit('init')
    // this.mq.on('init', () => {
    //
    // })
  }

  start() {
    this.running = true
    this._loop()
  }

  stop() {
    this.running = false
  }

  async _loop() {
    logger.info('server started')
    while (this.running) {
      await this._tick()
    }
    logger.info('server stopped')
  }

  async _tick() {
    await sleep(1000)
  }

  /**
   *
   * @param message
   * @returns {Promise<void>}
   */
  async onTask(message) {
    const readStringAsync = bluebird.promisify(message.readString, {
      context: message
    })
    const body = await readStringAsync('utf-8')
    logger.debug('received message: ' + body)

    try {
      const body_json = JSON.parse(body)
      const func = this._commands[body_json.command]
      if (func) {
        func.call(this, body_json.payload)
      } else {
        logger.warn(`no command binding for ${body}`)
      }
    } catch (err) {
      logger.error(`error when processing message: ${body}`)
      logger.error(err)
    }
    this.mq.ack(message)
  }

  async onTokenTransfer(payload) {
    logger.info('OnTokenTransfer', payload)

    const contractAddress = payload.contractAddress.toLowerCase()
    if (contractAddress === contract_address) {
      const token_id = parseInt(payload.tokenId)
      const data = await Miraco.methods.ownerOf(token_id).call()
      console.log('TokenOWner address:', data)

      const tokenApprovedBy = await Miraco.methods.getApproved(token_id).call()
      console.log('Token approved by', tokenApprovedBy)
      console.log('Contract owner', contract_owner)

      try {
        const receipt = await Miraco.methods
          .transferFrom(payload.from, payload.to, token_id)
          .send()
        await this.mq.sendAsync(mint_receipt_queue_header, {
          command: 'TOKEN_TRANSFER',
          code: 0,
          payload: {
            tranacstion_id: payload.transaction_id,
            from: payload.from,
            newOwner: payload.to,
            tokenId: payload.tokenId,
            contractAddress: contractAddress,
            blockNumber: receipt.blockNumber,
            blockHash: receipt.blockHash,
            txHash: receipt.transactionHash
          }
        })
        logger.info('token transaction success')
      } catch (err) {
        await this.mq.sendAsync(mint_receipt_queue_header, {
          command: 'TOKEN_TRANSFER',
          code: -2,
          message: `Transaction failure: ${err.message}`,
          payload: {
            transaction_id: payload.transaction_id,
            tokenId: payload.tokenId,
            contractAddress: contractAddress
          }
        })
        logger.info('token transaction failure')
      }
    } else {
      logger.error(
        `this contract address ${contractAddress} is not supported anymore\n new contract address is ${contract_address}`
      )
      await this.mq.sendAsync(mint_receipt_queue_header, {
        command: 'TOKEN_TRANSFER',
        code: -1,
        message: 'your contract address is obsoleted',
        payload: {
          transaction_id: payload.transaction_id,
          tokenId: payload.tokenId,
          contractAddress: contractAddress
        }
      })
    }
  }

  async onTransactionSigned(payload) {
    const contractAddress = payload.contractAddress.toLowerCase()
    if (contractAddress === contract_address) {
      try {
        const receipt = await web3.eth.sendSignedTransaction(
          payload.dataSigned
        )

        await this.mq.sendAsync(mint_receipt_queue_header, {
          command: 'TOKEN_TRANSFER_RAW',
          code: 0,
          payload: {
            transaction_id: payload.transaction_id,
            tokenId: payload.tokenId,
            contractAddress: payload.contractAddress,
            blockNumber: receipt.blockNumber,
            blockHash: receipt.blockHash,
            txHash: receipt.transactionHash
          }
        })
      } catch (err) {
        await this.mq.sendAsync(mint_receipt_queue_header, {
          command: 'TOKEN_TRANSFER_RAW',
          code: -2,
          message: `Transaction failure: ${err.message}`,
          payload: {
            transaction_id: payload.transaction_id,
            tokenId: payload.tokenId,
            contractAddress: payload.contractAddress
          }
        })
      }
    } else {
      logger.error(
        `this contract address ${contractAddress} is not supported anymore\nnew contract address is ${contract_address}`
      )
      await this.mq.sendAsync(mint_receipt_queue_header, {
        command: 'TOKEN_TRANSFER_RAW',
        code: -1,
        message: 'your contract address is obsoleted',
        payload: {
          transaction_id: payload.transaction_id,
          tokenId: payload.tokenId,
          contractAddress: contractAddress
        }
      })
    }
  }

  async onMintToken(payload) {
    logger.info('OnMintToken', payload)
    const tokenOwnerAddress = payload.publicAddress.toLowerCase()
    const mintDetail = payload.tokenDetail

    const receipt = await Miraco.methods
      .addIssuer(mintDetail.brand, mintDetail.symbol)
      .send()
      .on('transactionHash', hash => {
        logger.debug(`on addIssuer transactionHash: ${hash}`)
      })
      .on('receipt', r => {
        logger.debug('on addIssuer receipt', r)
      })
    logger.info('addIssuer OK')
    const issuerId = parseInt(
      receipt.events.IssuerAdded.returnValues._issuerId
    )

    for (let v of mintDetail.variants) {
      for (let i = 0; i < v.amount; i += singleMintCountMax) {
        const count = Math.min(singleMintCountMax, v.amount - i)
        const unique_sig = []
        const proofs = []
        const toAddresses = []
        for (let j = 0; j < count; j++) {
          const _uuid = uuid()
          unique_sig.push(_uuid)
          proofs.push(proofHash(_uuid))
          toAddresses.push(tokenOwnerAddress)
        }

        try {
          let mintMultipleReceipt = await Miraco.methods
            .mintAssets(issuerId, toAddresses, proofs)
            .send()
            .on('transactionHash', hash => {
              logger.debug(`on mintAssets transactionHash: ${hash}`)
            })
            .on('receipt', r => {
              logger.debug('on mintAssets receipt', r)
            })
          logger.info('mintReceipt received.')
          if (mintMultipleReceipt.status) {
            logger.info('Tokens minted:')
            if (mintMultipleReceipt.events.Transfer instanceof Array) {
              let i = 0
              for (let t of mintMultipleReceipt.events.Transfer) {
                logger.info('token id', t.returnValues._tokenId)

                await this.mq.sendAsync(mint_receipt_queue_header, {
                  command: 'TOKEN_ISSUE',
                  payload: {
                    to: tokenOwnerAddress,
                    tokenId: t.returnValues._tokenId,
                    uniqueSig: unique_sig[i],
                    blockNumber: mintMultipleReceipt.blockNumber,
                    blockHash: mintMultipleReceipt.blockHash,
                    txHash: mintMultipleReceipt.transactionHash,
                    contractAddress: t.address.toLowerCase(),
                    variantId: v.variantId
                  }
                })
                i += 1
              }
            } else {
              const t = mintMultipleReceipt.events.Transfer
              logger.info('token id', t.returnValues._tokenId)
              await this.mq.sendAsync(mint_receipt_queue_header, {
                command: 'TOKEN_ISSUE',
                payload: {
                  to: tokenOwnerAddress,
                  tokenId: t.returnValues._tokenId,
                  uniqueSig: unique_sig[0],
                  blockNumber: mintMultipleReceipt.blockNumber,
                  blockHash: mintMultipleReceipt.blockHash,
                  txHash: mintMultipleReceipt.transactionHash,
                  contractAddress: t.address.toLowerCase(),
                  variantId: v.variantId
                }
              })
            }
          } else {
            logger.error('mint receipt status is not 1 ')
          }
        } catch (err) {
          logger.error(err)
        }
      }
    }
    logger.info('All tokens in this batch minted')
    //let mintSingleReceipt = await Miraco.methods.mintAsset(ICOOwner, issuerId, proof).send()

    //const token_id = parseInt(mintSingleReceipt.events.Transfer.returnValues._tokenId)
    //console.log(mintSingleReceipt.events)
    //console.log(token_id)

    // call mintAssets: issuerId, to array , proof array
    /*
    let mintMultipleReceipt = await Miraco.methods.mintAssets(issuerId,
      toAddresses, ['0x0', '0x0', '0x0', '0x0', '0x0', '0x0', '0x0', '0x0', '0x0', '0x0'])
      .send()
     */
  }
}
