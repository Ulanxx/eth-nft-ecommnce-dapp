import { observable, action, computed } from 'mobx'
import bind from '../../base/bind'
import { ModalStore } from '../../base/modalStore.js'
import { listTokens } from './api'
import toasterStore from '../../base/Toaster/store'
import { Loadings } from '../../base/loadings'
import { listToBatchs } from './transforms'
import { isNil, sum, map, sortBy } from 'lodash'

const loadings = new Loadings()

export class TokenStore {

  modalStore = new ModalStore({
    afterOk: this.listTokens
  })

  loadings = loadings

  @computed get currentBatchForTransfer() {
    const currentBatch = !isNil(this.modalStore.id) && this.batchs.find(
      batch => batch.id === this.modalStore.id
    )
    return currentBatch
  }

  @observable.ref list = []

  @computed get batchs() {
    return listToBatchs(this.list) || []
  }

  @computed get listForDisplay() {
    return sortBy(this.batchs, ({ mintedDateValue }) => -mintedDateValue)
  }

  //  token 共有多少批次种类
  @computed get tokenSpecies() {
    return this.batchs.length
  }

  // 已发出的 token 数量
  @computed get tokenTransferredAmount() {
    return sum(map(this.batchs, 'amountTransferred'))
  }

  // 总共发行的 token 数量
  @computed get tokenAmount() {
    return sum(map(this.batchs, 'amountSupply'))
  }

  @bind
  @action setList(list) {
    this.list = list
  }

  @bind
  @toasterStore.handle()
  listTokens() {
    return listTokens().then(this.setList)
  }

  @loadings.handle('list')
  listTokensWithLoading() {
    return this.listTokens()
  }

}

export default new TokenStore()
