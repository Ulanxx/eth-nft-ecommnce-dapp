import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Layout from '../Layout'
import BrandOwner from '../BrandOwner'
import Toaster from '../../base/Toaster'

import './style.less'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route path='/signin' render={() => <div>signin</div>}/>
          <Route path='/brand-owners'>
            <Layout>
              <BrandOwner></BrandOwner>
            </Layout>
          </Route>
          <Route path='/'>
            <Redirect to='/brand-owners'></Redirect>
          </Route>
        </Switch>
        <Toaster></Toaster>
      </div>
    )
  }
}

export default App
