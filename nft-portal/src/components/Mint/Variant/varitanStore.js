import { observable, action } from 'mobx'
import store from '../../../base/store'
import bind from '../../../base/bind'


export class ViritanStore extends store {

  @observable.ref name = null
  @observable.ref sku = null
  @observable.ref barcode = null
  @observable.ref amount= 0
  @observable.ref selected = true

  constructor(name, sku, barcode, amount, selected) {
    super()
    this.setName(name)
    this.setBarcode(barcode)
    this.setSku(sku)
    this.setAmount(amount)
    this.setSelected(selected)
  }

  @bind
  @action setName(name) {
    this.name = name
  }

  @bind
  @action setSku(sku) {
    this.sku = sku
  }

  @bind
  @action setBarcode(barcode) {
    this.barcode = barcode
  }

  @bind
  @action setAmount(amount) {
    this.amount = amount
  }

  @bind
  @action setSelected(selected) {
    this.selected = selected
  }

}
