import React, { Component } from 'react'
import enUS from 'antd/lib/locale-provider/en_US';
import LocaleProvider from 'antd/lib/locale-provider';
import { Route, Switch, Redirect } from 'react-router-dom'
import Signin from '../Signin'
import Token from '../Token'
import Transactions from '../Transfer'
import Toaster from '../../base/Toaster'
import Layout from '../Layout'
import Mint from '../Mint'
import Detail from '../Detail'
import Enduser from '../Enduser'
import OverviewToken from '../Enduser/OverviewDetail'
import HistoryToken from '../Enduser/HistoryDetail'

import './style.less'


class App extends Component {
  render() {
    return (
      <LocaleProvider locale={enUS}>
        <div className="app">
          <Switch>
            <Route path='/signin'>
              <Signin></Signin>
            </Route>
            <Route path='/tokens/mint'>
              <Mint></Mint>
            </Route>
            <Route path='/tokens/:id'>
              <Detail></Detail>
            </Route>
            <Route path='/tokens'>
              <Token></Token>
            </Route>
            <Route path='/bills'>
              <Layout>
                <div>bills</div>
              </Layout>
            </Route>
            <Route path='/transactions'>
              <Transactions></Transactions>
            </Route>
            <Route path='/enduser'>
              <Enduser></Enduser>
            </Route>
            <Route path='/overview/token'>
              <OverviewToken></OverviewToken>
            </Route>
            <Route path='/history/token'>
              <HistoryToken></HistoryToken>
            </Route>
            <Route path='/'>
              <Redirect to='/tokens'></Redirect>
            </Route>
          </Switch>
          <Toaster></Toaster>
        </div>
      </LocaleProvider>
    )
  }
}

export default App
