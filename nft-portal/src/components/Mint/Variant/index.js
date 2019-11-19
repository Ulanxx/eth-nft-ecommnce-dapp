import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { observer } from "mobx-react"
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Checkbox from 'antd/lib/checkbox'
import InputNumber from 'antd/lib/input-number'
import FormItem from '../../../base/FormItem'
import { floor, isNumber } from 'lodash'

import './style.less'

export const Variant = observer(({ store }) => (
  <div className="comp-variant">
    {
      store.showHeader
      ? <VariantHeader></VariantHeader>
      : null
    }
    {
      store.options.map(
        (option, index) => (
          <VariantItem
            {...option}
            key={index}
            onDel={() => store.removeOption(index)}
            onNameChange={name => store.setName(index, name)}
            onValuesChange={values => store.setValues(index, values)}
          >
          </VariantItem>
        )
      )
    }
    {
      store.canAddMore
        ? <Button style={{ margin: '10px 0px' }} onClick={store.addOption}>Add another option</Button>
        : null
    }
    {
      store.variantsForEdit.length
        ? <Creater list={store.variantsForEdit}></Creater>
        : null
    }
  </div>
))

const VariantHeader = () => (
  <Row gutter={20}>
    <Col span={6}>
      Option Name
    </Col>
    <Col span={16}>
      Option Values
    </Col>
  </Row>
)

const VariantItem = observer(({ name, values, onNameChange, onValuesChange, onDel }) => (
  <Row gutter={20} style={{ paddingBottom: '10px' }}>
    <Col span={6}>
      <Input value={name} onChange={(e) => onNameChange(e.target.value)}></Input>
    </Col>
    <Col span={16}>
      <ValuesInput value={values} onChange={onValuesChange}></ValuesInput>
    </Col>
    <Col span={2}>
      <Button onClick={onDel}><Icon type="delete" theme="outlined"/></Button>
    </Col>
  </Row>
))

const Creater = observer(({ list }) => {
  return (
    <div>
      <Row gutter={20} style={{ paddingBottom: '10px' }}>
        <Col span={2}>

        </Col>
        <Col span={6}>
          Variant
        </Col>
        <Col span={6}>
          SKU
        </Col>
        <Col span={6}>
          Price ($)
        </Col>
        <Col span={4}>
          Quantity
        </Col>
      </Row>
      {
        list && list.map(
          variant => (
            <Row type="flex" justify="space-between" align="top" gutter={20} key={variant.$('variant').value}>
              <Col span={2}>
                <OCheckbox variant={variant}></OCheckbox>
              </Col>
              <Col span={6}>
                <span>{variant.$('variant').value}</span>
              </Col>
              <Col span={6}>
                <FormItem
                  field={variant.$('sku')}
                >
                  <SkuInput variant={variant}></SkuInput>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  field={variant.$('price')}
                >
                  <PriceInput variant={variant}></PriceInput>
                </FormItem>
              </Col>
              <Col span={4}>
                <AmountInput variant={variant}></AmountInput>
              </Col>
            </Row>
          )
        )
      }
    </div>
  )
})

class ValuesInput extends Component {

  dom = null

  setDom = dom => this.dom = dom

  componentDidMount() {
    // 此处为hack 解决不支持 enter
    const rootRef = findDOMNode(this.dom)
    const input = rootRef.querySelector('input')
    rootRef.addEventListener('keyup', event => {
      event.preventDefault()
      if (event.keyCode === 13 && input.value) {
        this.props.onChange([...this.props.value, input.value])
        input.value = null
      }
    })
  }

  render() {
    return (
      <Select
        ref={this.setDom}
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Please select"
        value={this.props.value}
        onChange={this.props.onChange}
        autoFocus={true}
        open={false}
        dropdownStyle={{ display: 'none' }}
      >
      </Select>
    )
  }
}

const OCheckbox = observer(({ variant }) => (
  <Checkbox
    checked={variant.$('selected').value}
    onChange={e => {
      const checked = e.target.checked
      if (!checked) {
        variant.showErrors(false)
      }
      variant.$('selected').set(checked)
    }}>
  </Checkbox>)
)

const SkuInput = observer(({ variant }) => <Input {...variant.$('sku').bind()}></Input>)

const PriceInput = observer(({ variant }) => <InputNumber min={0} {...variant.$('price').bind()}></InputNumber>)

const AmountInput = observer(({ variant }) => (
  <InputNumber
    min={0}
    value={variant.$('amount').value}
    onChange={
      value => isNumber(value) && variant.$('amount').set(floor(value))
    }
  ></InputNumber>
))
