import React, { Component } from 'react'
import { parse } from "../../../base/query-string";
import { withRouter } from "react-router-dom";
import registerPermission from "../../../base/permission";
import enduserRequired from "../../../base/permissions/enduserRequire";
import { observer } from "mobx-react/index";
import { HistoryDetailStore } from "./store"
import NavBar from 'antd-mobile/lib/nav-bar'
import List from 'antd-mobile/lib/list'
import DEFAULT_ICON from "../../../global/assets/default-token-icon.png"
import Icon from 'antd-mobile/lib/icon'
import Tag from 'antd/lib/tag'
import {  transferStatusMapText, transferProgressStatusMapColor, transferProgressStatusMapText } from '../constants'
import * as moment from 'moment'
import '../style.less'

const Item = List.Item

@withRouter
@registerPermission(enduserRequired)
@observer
export default class Detail extends Component {

  store = new HistoryDetailStore()

  componentDidMount() {
    const { location } = this.props
    const query = parse(location.search);
    this.store.setHistoryDetail(query)
  }

  render() {
    const { createdAt, from, to, status, swapStatus, tokenId, txHash, symbol, name, url } = this.store.detail;
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
        <List renderHeader={
          () => <div style={{overflow: 'hiden'}}>
              <span>Transaction Info</span>
              <Tag style={{float: 'right', margin: '0px'}} color={transferProgressStatusMapColor[status]}>{transferStatusMapText[swapStatus]}</Tag>
            </div>
          }>
          <Item extra={symbol}>
            <img src={url || DEFAULT_ICON} style={{ width: 30, height: 30, borderRadius: 15 }}/>
          </Item>
          <Item extra={name}>Name</Item>
          <Item extra={tokenId}>Token ID</Item>
          <Item extra={<Tag style={{margin: '0px'}} color={transferProgressStatusMapColor[status]}>{transferProgressStatusMapText[status]}</Tag>}>Status</Item>
          <Item extra={moment(createdAt).format('YY-MM-DD HH:mm')}>Timestamp</Item>
          <Item wrap multipleLine>From
            <div className='comp-history-item'>{from}</div>
          </Item>
          <Item multipleLine wrap>To
            <div className='comp-history-item'>{to}</div>
          </Item>
          <Item multipleLine wrap>TxHash
            <div className='comp-history-item'>{txHash}</div>
          </Item>
        </List>
      </div>
    )
  }
}


