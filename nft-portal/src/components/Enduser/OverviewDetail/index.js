import React, { Component } from 'react'
import { parse } from "../../../base/query-string";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react/index";
import { OverviewDetailStore } from "./store"
import NavBar from 'antd-mobile/lib/nav-bar'
import List from 'antd-mobile/lib/list'
import DEFAULT_ICON from "../../../global/assets/default-token-icon.png"
import Icon from 'antd-mobile/lib/icon'
import registerPermission from "../../../base/permission";
import enduserRequired from "../../../base/permissions/enduserRequire";
import { statusMapColor, statusMapText } from './constants'
import Tag from 'antd/lib/tag'
import Button from 'antd-mobile/lib/button'
import verifyStore from '../Verify/store'
import WhiteSpace from 'antd-mobile/lib/white-space'
import WingBlank from 'antd-mobile/lib/wing-blank'

import '../style.less'

const Item = List.Item;

@withRouter
@registerPermission(enduserRequired)
@observer
export default class Detail extends Component {

  store = new OverviewDetailStore()

  componentDidMount() {
    const { location } = this.props
    const query = parse(location.search);
    this.store.setTokenDetail(query)
  }

  render() {
    const { url, symbol, name, title, category, brand, description, tokenId, variant, price, sku, status, uniqueSig } = this.store.detail;
    return (
      <div style={{ backgroundColor: '#f7f7f7' }}>
        <NavBar
          className="comp-enduser-nav"
          mode="light"
          leftContent={<Icon type="left" color='#333' size='md' onClick={() => {
            window.history.back()
          }}/>}
        >Miraco
        </NavBar>
        <List renderHeader={() => 'Token Informations'}>
          <Item extra={symbol}>
            <img src={url || DEFAULT_ICON} style={{ width: 30, height: 30, borderRadius: 15 }}/>
          </Item>
          <Item extra={name}>Name</Item>
          <Item extra={tokenId}>Token ID</Item>
          <Item extra={<Tag color={statusMapColor[status]}>{statusMapText[status]}</Tag>}>Status</Item>
        </List>
        <List renderHeader={() => 'Product Informations'}>
          <Item extra={brand}>Brand</Item>
          <Item extra={title}>Product Title</Item>
          <Item extra={category}>Category</Item>
          <Item extra={variant}>Variant</Item>
          <Item extra={price}>Price</Item>
          <Item extra={sku}>SKU</Item>
          <Item multipleLine wrap>Description
            <div className='comp-history-item'>{description}</div>
          </Item>
        </List>
        <WhiteSpace>
        </WhiteSpace>
        <WingBlank>
          <Button
            type="primary"
            onClick={() => verifyStore.verify(uniqueSig)}>
            Verify
          </Button>
        </WingBlank>
      </div>
    )
  }
}


