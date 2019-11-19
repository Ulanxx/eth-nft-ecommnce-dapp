import { observable, action, computed } from 'mobx'
import bind from '../../base/bind'
import store from '../../base/store'
import { listTokens } from './api'
import { tokensForDispaly } from './transforms'
import { ModalStore } from '../../base/modalStore.js'
import { Loadings } from '../../base/loadings'

const loadings = new Loadings()

export class DetailStore extends store {

  loadings = loadings

  @observable.ref tokens = []

  @computed get currentTokenForTransfer() {
    return this.tokensForDisplay.find(({ tokenId }) => tokenId === this.transferStore.id)
  }

  transferStore = new ModalStore({
    afterOk: this.listTokens
  })

  @computed get tokensForDisplay() {
    return tokensForDispaly(this.tokens)
  }

  // brand: "Nike"
  // category: "Pants"
  // description: "awesome!!"
  // name: "NikeCoin"
  // symbol: "NKC"
  @computed get overview() {
    return this.tokens[0] || {}
  }

  @bind
  @action setTokens(tokens) {
    this.tokens = tokens
  }

  @bind
  listTokens(batchId) {
    return listTokens(batchId).then(
      ({ variants }) => this.setTokens(variants)
    )
  }

  @bind
  @loadings.handle('list')
  listTokensWithLoding(batchId) {
    return this.listTokens(batchId)
  }

}
