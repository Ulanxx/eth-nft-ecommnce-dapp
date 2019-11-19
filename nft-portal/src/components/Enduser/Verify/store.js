import React, { Component } from 'react'
import Store from '../../../base/store'
import bind from '../../../base/bind'
import { prompt, alert } from 'antd-mobile/lib/modal'
import { verification } from '../api'

export class VerifyStore extends Store {

  @bind
  verification(uniqueSig) {
    return verification(uniqueSig).then(
      ({ verification, productDetail }) => {
        if (verification) {
          alert(
            'Congratulations',
            <div>
              <div>Verification seccess !</div>
              <div>symbol: {productDetail.symbol}</div>
              <div>title: {productDetail.title}</div>
              <div>category: {productDetail.category}</div>
              <div>name: {productDetail.name}</div>
              <div>description: {productDetail.description}</div>
              <div>variant: {productDetail.variant}</div>
              <div>price: {productDetail.price}</div>
              <div>sku: {productDetail.sku}</div>
            </div>,
            [{ text: 'OK' }]
          )
        } else {
          alert('Oops!!', 'Verification faild', [{ text: 'OK' }])
        }
      }
    )
  }

  @bind
  verify(uniqueSig) {
    prompt(
      'input code',
      null,
      [
        {
          text: 'Cancel',
          onPress: value => Promise.resolve(),
        },
        {
          text: 'Submit',
          onPress: this.verification,
        },
      ],
      'default',
      uniqueSig,
      ['input code']
    )
  }
}


export default new VerifyStore()
