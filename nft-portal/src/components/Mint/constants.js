import validatorjs from 'validatorjs'

const apparel = {
  name: 'Apparel',
  children: [
    {
      name: 'Sweaters'
    },
    {
      name: 'Cardigans'
    },
    {
      name: 'Coats'
    },
    {
      name: 'Jackets'
    },
    {
      name: 'Pants'
    },
    {
      name: 'Shorts'
    }
  ]
}

const accessories = {
  name: 'Accessories',
  children: [
    {
      name: 'Bags'
    },
    {
      name: 'Wallets'
    }
  ]
}

export const category = [
  apparel,
  accessories
]


export const plugins = {dvr: validatorjs}

export const fields = [{
  name: 'symbol',
  label: 'Token symbol',
  placeholder: 'Symbol',
  rules: 'required|string',
}, {
  name: 'brand',
  label: 'Brand name',
  placeholder: 'Brand',
  rules: 'required|string',
}, {
  name: 'name',
  label: 'Token full name',
  placeholder: 'name',
  rules: 'required|string',
}, {
  name: 'category',
  label: 'Category',
  placeholder: 'Category'
}, {
  name: 'description',
  label: 'Description',
  placeholder: 'Description'
}, {
  name: 'title',
  label: 'Product title',
  placeholder: 'Title',
  rules: 'required|string',
},{
  name: 'url',
  label: 'Upload Token Icon',
  rules: 'string',
}]
