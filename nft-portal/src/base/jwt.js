import { observable, autorun, action } from 'mobx'
import store from './store';

export class Jwt extends store {

  @observable value = null

  @action setValue(value) {
    this.value = value
  }

  clear() {
    this.setValue(null)
    localStorage.setItem('jwt', this.value)
  }

  constructor() {
    super()
    this.addDisposer(autorun(
      () => this.value && localStorage.setItem('jwt', this.value)
    ))
    const jwt = localStorage.getItem('jwt')
    this.setValue(jwt)
  }
}


export default new Jwt()
