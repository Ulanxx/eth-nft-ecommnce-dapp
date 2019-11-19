import store from './store'
import bind from './bind'
import { observable, action } from 'mobx'

export class ModalStore extends store {

  @observable active = false
  @observable id = null

  constructor({
    afterActive,
    afterCancel,
    afterOk,
    beforeOk,
    beforeCancel
  }) {
    super()
    this.afterActive = afterActive
    this.afterCancel = afterCancel
    this.afterOk = afterOk
    this.beforeOk = beforeOk
    this.beforeCancel = beforeCancel
  }

  @action setActive(active) {
    this.active = active
  }

  @action setId(id) {
    this.id = id
  }

  @bind
  start() {
    this.setActive(true)
  }


  @bind
  onCancel(...args) {
    this.beforeCancel && this.beforeCancel(...args)
    this.setActive(false)
    this.afterCancel && this.afterCancel(...args)
    this.setId(null)
  }

  @bind
  onOk(...args) {
    this.beforeOk && this.beforeOk(...args)
    this.setActive(false)
    this.afterOk && this.afterOk(...args)
    this.setId(null)
  }
}
