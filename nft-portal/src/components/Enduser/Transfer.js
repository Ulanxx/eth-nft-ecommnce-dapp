import React, { Component } from 'react'
import { computed, observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'
import List from 'antd-mobile/lib/list'
import InputItem from 'antd-mobile/lib/input-item'
import Picker from 'antd-mobile/lib/picker'
import WhiteSpace from 'antd-mobile/lib/white-space'
import WingBlank from 'antd-mobile/lib/wing-blank'
import Button from 'antd-mobile/lib/button'
import bind from '../../base/bind'
import { getAbi } from './transfroms'
import userStore from '../../base/userStore'
import { gas, gasPrice } from './constants'
import Web3 from 'web3'
import { find } from 'lodash'
import { transferMark } from './api'
import { Loadings } from '../../base/loadings'
import toasterStore from '../../base/Toaster/store'

const Item = List.Item
const loadings = new Loadings()

const buildTransferTx = function(contractAddress, data, from, nonce) {
  return {
    from,
    to: contractAddress,
    gasPrice,
    gas,
    nonce,
    data
  }
}


@observer
export default class Transfer extends Component {

  loadings = loadings

  // for transfer
  @observable selected = null

  // for transfer
  @observable address = null

  @computed get tokens() {
    return this.props.tokens
  }

  @computed get selectedToken() {
    return find(this.tokens, { value: this.selected })
  }

  @bind
  @action setAddress(address) {
    this.address = address
  }

  @bind
  @action setSelected([value]) {
    this.selected = value
  }


  @bind
  @loadings.handle('transfer')
  @toasterStore.handleInfo('Transaction has been commited')
  handleTransfer() {

    if (!window.web3) {
      return Promise.reject({ code: 10001 })
    }

    const to = this.address

    if (!to) {
      return Promise.reject({ code: 30001 })
    }

    const onSuccess = this.props.onSuccess
    const web3 = new Web3(window.web3.currentProvider)

    if (!web3.utils.isAddress(to)) {
      return Promise.reject({ code: 30002 })
    }

    const from = userStore.publicAddress

    const tokenId = this.selectedToken.tokenId
    const contractAddress = this.selectedToken.contractAddress
    const abi = getAbi()
    const promise = web3.eth.getTransactionCount(from).then(
      nonce => {
        const data = web3.eth.abi.encodeFunctionCall(abi, [from, to, tokenId])
        const tx = buildTransferTx(contractAddress, data, from, nonce + 10)
        return web3.eth.sendTransaction(tx).then(
          ({ transactionHash }) => transferMark(contractAddress, tokenId, to, transactionHash)
        )
      }
    )

    promise.then(
      () => onSuccess && onSuccess()
    )
    return promise
  }

  componentDidMount() {

    // 默认选中第一个
    reaction(
      () => this.tokens,
      tokens => {
        if (tokens && tokens.length) {
          this.setSelected([tokens[0].value])
        }
      },
      { fireImmediately: true }
    )
  }

  render() {
    return (
      <div className="comp-enduser-transfer">
        <List
          renderHeader={() => 'Transfer'}
        >
          <Picker data={this.tokens} value={[this.selected]} onChange={this.setSelected} cols={1}>
            <Item>
              Symbol
            </Item>
          </Picker>
          <InputItem value={this.address} onChange={this.setAddress}>
            Address
          </InputItem>
        </List>
        <WhiteSpace/>
        <WingBlank>
          <Button
            disabled={this.loadings.isLoading('transfer')}
            type="primary"
            onClick={this.handleTransfer}>
            Transfer
          </Button>
        </WingBlank>
      </div>
    )
  }
}
