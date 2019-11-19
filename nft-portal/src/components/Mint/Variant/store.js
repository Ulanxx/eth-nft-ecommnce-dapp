import { observable, action, computed, autorun } from 'mobx'
import store from '../../../base/store'
import { getOptionName } from './transforms'
import { optionNamePresets } from './constants'
import { OptionStore } from './optionStore'
import { uniq } from 'lodash'
import { cartesianProduct } from 'js-combinatorics'
import { fields, plugins } from './constants'
import MobxReactForm from 'mobx-react-form'
import { omit } from 'lodash'
import { sum } from 'lodash'
import bind from '../../../base/bind'


export class VariantStore extends store {


  @observable.shallow options = []

  @observable.ref variantsForEdit = []

  @computed get total() {
    return sum(this.variantsForMint.map(v => v.amount))
  }

  @computed get variantsForMint() {
    return this.variantsForValidate.map(
      variant => omit(variant.values(), 'selected')
    )
  }

  @computed get variantsForValidate() {
    return this.variantsForEdit.filter(
      variant => variant.$('selected').value
    )
  }

  @computed get arrayForViritans() {
    return this.options.map(
      o => o.values
    ).filter(
      v => v.length
    )
  }

  @computed get variants() {
    if (this.arrayForViritans.length === 0) {
      return []
    }
    return cartesianProduct(...this.arrayForViritans).toArray()
  }

  @computed get canAddMore() {
    return this.options.length < 3
  }

  @computed get showHeader() {
    return this.options.length > 0
  }

  @computed get usedOptionNames() {
    return this.options.map(option => option.name).filter(name => name)
  }

  @bind
  setName(index, name) {
    this.options[ index ].setName(name)
  }

  @bind
  setValues(index, values) {
    this.options[ index ].setValues(uniq(values))
  }

  @bind
  @action addOption() {
    if (!this.canAddMore) {
      return
    }
    const option = new OptionStore()
    const recomendName = getOptionName(optionNamePresets, this.usedOptionNames)
    option.setName(recomendName)
    this.options.push(option)
  }

  @bind
  @action removeOption(index) {
    this.options.splice(index, 1)
  }

  @bind
  @action setViritansForEdit(variantsForEdit) {
    this.variantsForEdit = variantsForEdit
  }

  validate() {
    this.variantsForEdit.forEach(
      variant => {
        variant.submit()
      }
    )
  }

  constructor() {
    super()
    autorun(
      () => this.setViritansForEdit(
        this.variants.map(
          variant => {
            const variantForm = new MobxReactForm({ fields }, { plugins })
            variantForm.$('variant').set(variant.join('.'))
            return variantForm
          }
        )
      )
    )


  }
}
