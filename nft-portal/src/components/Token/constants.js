import validatorjs from 'validatorjs'

export const plugins = { dvr: validatorjs }

export const fields = {
  to: {
    rules: 'required',
    label: 'To Address'
  },
  variantId: {
    label: 'Variant'
  },
  amount: {
    value: 1,
    label: 'Quantity'
  },
  tokenId: {
    label: 'Token ID'
  }
}
