import React, { Component } from 'react'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Select from 'antd/lib/select'
import Form from 'antd/lib/form'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import FormItem from '../../base/FormItem'
import MobxReactForm from 'mobx-react-form'
import { fields, plugins } from './constants'
import { observer } from 'mobx-react'
import { transfer, transferSingle } from './api'
import toasterStore from '../../base/Toaster/store'
import { Loadings } from '../../base/loadings'
import bind from '../../base/bind'
import { computed } from 'mobx'
import { isNil, floor, isNumber } from 'lodash'
import './style.less'

const Option = Select.Option

const loadings = new Loadings()

@observer
export default class Transfer extends Component {

  loadings = loadings

  form = new MobxReactForm(
    { fields },
    {
      plugins, hooks: {
        onSubmit: from => {
          if (from.isValid) {
            this.hanldeOk()
          }
        }
      }
    }
  )

  @computed get needAmount() {
    return isNil(this.props.token)
  }

  componentDidMount() {
    if (this.needAmount) {
      this.form.$('variantId').set(this.props.variants[0].variantId)
    } else {
      this.form.$('tokenId').set(this.props.token.tokenId)
    }
  }

  @bind
  @toasterStore.handleInfo('Being transferred')
  @loadings.handle('transfer')
  hanldeOk() {
    const { to, tokenId, variantId, amount } = this.form.values()
    const promise = this.needAmount
      ? transfer({ to, variantId, amount })
      : transferSingle({ tokenId, to, contractAddress: this.props.token.contractAddress })
    promise.then(this.props.onOk)
    return promise
  }

  renderAmount() {
    return (
      <Form>
        <FormItem field={this.form.$('to')}>
          <Input {...this.form.$('to').bind()}></Input>
        </FormItem>
        <FormItem field={this.form.$('variantId')}>
          <Select {...this.form.$('variantId').bind()}>
            {
              this.props.variants.map(
                variant => <Option key={variant._id} value={variant.variantId}>{variant.variant}</Option>
              )
            }
          </Select>
        </FormItem>
        <FormItem field={this.form.$('amount')}>
          <InputNumber
            min={1}
            value={this.form.$('amount').value}
            onChange={
              value => isNumber(value) && this.form.$('amount').set(floor(value))
            }
          >
          </InputNumber>
        </FormItem>
      </Form>
    )
  }

  renderToken() {
    const token = this.props.token
    return (
      <Form>
        <Row>
          <Col span={12}>
            <div className={'transfer-item-container'}>
              <span>TokenId ：</span>
              <p>{token.tokenId}</p>
            </div>

          </Col>
          <Col span={12}>
            <div className={'transfer-item-container'}>
              <span>SKU ：</span>
              <p>{token.sku}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div className={'transfer-item-container'}>
              <span>Variant ：</span>
              <p>{token.variant}</p>
            </div>
          </Col>
          <Col span={12}>
            <div className={'transfer-item-container'}>
              <span>Price ：</span>
              <p>${token.price}</p>
            </div>
          </Col>
        </Row>
        <FormItem field={this.form.$('to')}>
          <Input {...this.form.$('to').bind()}></Input>
        </FormItem>
      </Form>
    )
  }


  render() {
    return (
      <Modal
        visible={true}
        onCancel={this.props.onCancel}
        onOk={this.form.onSubmit}
        title="Transfer"
      >
        {
          this.needAmount
            ? this.renderAmount()
            : this.renderToken()
        }
      </Modal>
    )
  }
}

