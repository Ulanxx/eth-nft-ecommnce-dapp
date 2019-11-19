import { observable, action, computed } from "mobx"
import { ModalStore } from '../../base/modalStore'
import bind from '../../base/bind'
import { createIssuer, listIssuer, delIssuer, updateIssuer } from './api'
import toasterStore from '../../base/Toaster/store'
import { Loadings } from '../../base/loadings'
import { omitBy, isNil } from 'lodash'

const loadings = new Loadings()

export class IssuerStore {

  loadings = loadings

  addModalStore = new ModalStore({
    afterOk: this.afterAdd
  })
  updateModalStore = new ModalStore({
    afterOk: this.afterUpdate
  })
  delModalStore = new ModalStore({
    afterOk: this.afterDel
  })

  @observable.ref issuers = []

  @computed get currentIssuerForUpdate() {
    return this.issuers.find(
      issuer => this.updateModalStore.id === issuer._id
    )
  }

  @bind
  @toasterStore.handle('创建成功')
  afterAdd(form) {
    const { companyName, publicAddress } = form.values()
    const promise = createIssuer(companyName, publicAddress)
    promise.then(this.list)
    return promise
  }

  @bind
  @toasterStore.handle('修改成功')
  afterUpdate(form) {
    const issuer = form.values()
    const promise = updateIssuer({...issuer, id: this.updateModalStore.id})
    promise.then(this.list)
    return promise
  }



  @bind
  @toasterStore.handle('删除成功')
  afterDel() {
    const promise = delIssuer(this.delModalStore.id).then(this.setIssuers)
    promise.then(this.list)
    return promise
  }

  @bind
  @toasterStore.handle()
  @loadings.handle('list')
  list() {
    return listIssuer().then(this.setIssuers)
  }

  @bind
  @action setIssuers(issuers) {
    this.issuers = issuers
  }

}
