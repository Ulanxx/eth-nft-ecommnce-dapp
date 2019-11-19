import validatorjs from 'validatorjs'

export const optionNamePresets = [
  'Size',
  'Color',
  'Material'
]

export const plugins = { dvr: validatorjs }

export const fields = {
  variant: {

  },
  sku: {
    rules: 'required'
  },
  price: {
    rules: 'required'
  },
  amount: {
    value: 0
  },
  selected: {
    value: true
  }
}
