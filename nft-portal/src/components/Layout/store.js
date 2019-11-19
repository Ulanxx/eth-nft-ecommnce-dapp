import { observable, action } from 'mobx'
import bind from '../../base/bind'

export class LayoutStore {

  @observable collapsed = true

  @action setCollapsed(collapsed) {
    this.collapsed = collapsed
  }

  @bind
  toggle() {
    this.setCollapsed(!this.collapsed)
  }

}

export default new LayoutStore()
