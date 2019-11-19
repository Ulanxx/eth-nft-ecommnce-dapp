import { observable, action } from 'mobx'
import store from '../../../base/store'
import bind from '../../../base/bind'


export class OptionStore extends store {

  @observable.ref name = null
  @observable.ref values = []

  @bind
  @action setName(name) {
    this.name = name
  }

  @bind
  @action setValues(values) {
    this.values = values
  }

}
