import { computed } from 'mobx'
import store from '../../base/store'
import { VariantStore } from './Variant/store'
import { UploadStore } from './Upload/store'
import bind from '../../base/bind'
import { mint } from './api';
import { plugins, fields } from './constants'
import MobxReactForm from 'mobx-react-form'
import toasterStore from '../../base/Toaster/store'
import { Loadings } from '../../base/loadings'

const loadings = new Loadings()

export class MintStore extends store {

  loadings = loadings

  variantStore = new VariantStore()

  form = new MobxReactForm(
    { fields },
    { plugins }
  )

  uploadStore = new UploadStore(this.form.$('url'))

  @computed get dataForMint() {
    return {
      ...this.form.values(),
      variants: this.variantStore.variantsForMint
    }
  }

  @bind
  @toasterStore.handleInfo('Publishing...')
  @loadings.handle('mint')
  mint() {
    const promise = Promise.all([
      this.form.validate(), ...this.variantStore.variantsForValidate.map(variant => variant.validate())
    ]).then(
      forms => {
        const allValide = forms.reduce(
          (pre, next) => pre && next.isValid,
          true
        )
        if (!allValide) {
          forms.forEach(
            form => !form.isValid && form.showErrors()
          )
          return Promise.reject({code: 20000})
        }
        if (!this.variantStore.total) {
          return Promise.reject({code: 20001})
        }
      }
    ).then(
      () => mint(this.dataForMint)
    )
    return promise
  }


}
