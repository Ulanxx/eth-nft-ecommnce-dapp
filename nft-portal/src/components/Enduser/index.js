import React, { Component } from 'react'
import enUS from 'antd-mobile/lib/locale-provider/en_US';
import LocaleProvider from 'antd-mobile/lib/locale-provider';
import Tabs from 'antd-mobile/lib/tabs'
import 'antd-mobile/dist/antd-mobile.css'
import { observer } from 'mobx-react'
import Overview from './Overview'
import Transfer from './Transfer'
import History from './History'
import { DetailStore } from './store'
import enduserRequired from '../../base/permissions/enduserRequire'
import { withRouter } from 'react-router-dom'
import registerPermission from '../../base/permission'
import { tabKeys, tabs } from './constants'
import NavBar from 'antd-mobile/lib/nav-bar'
import Icon from 'antd/lib/icon'
import verifyStore from './Verify/store'

import './style.less'


@withRouter
@registerPermission(enduserRequired)
@observer
export default class Enduser extends Component {

  store = new DetailStore()

  componentDidMount() {
    this.store.listTokens()
    this.store.listTransferHistory()
  }

  render() {
    return (
      <LocaleProvider locale={enUS}>
        <div className="comp-enduser">
          <NavBar
            className="comp-enduser-nav"
            mode="light"
            rightContent={<div onClick={verifyStore.verify}><Icon type="qrcode" theme="outlined"/></div>}
          >Miraco
          </NavBar>
          <Tabs
            tabs={tabs}
            tabBarPosition="bottom"
            page={this.store.page}
            onChange={this.store.setPage}
          >
            <Overview
              key={tabKeys.overview}
              tokens={this.store.tokensForDisplay}>
            </Overview>
            <Transfer
              key={tabKeys.transfer}
              tokens={this.store.tokensForSelector}
              onSuccess={this.store.handleTransferSuccess}
            >
            </Transfer>
            <History
              key={tabKeys.history}
              list={this.store.transferHistorysForTransStatus}
            ></History>
          </Tabs>
        </div>
      </LocaleProvider>
    )
  }
}

