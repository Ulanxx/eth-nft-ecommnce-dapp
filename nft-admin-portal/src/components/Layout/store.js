import { observable, action } from 'mobx'


export class LayoutStore {

  @observable collapsed = false

  @action setCollapsed(collapsed) {
    this.collapsed = collapsed
  }

}

export default new LayoutStore()
