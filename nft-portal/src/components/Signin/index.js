import React, { Component } from 'react'
import Button from 'antd/lib/button'
import bind from '../../base/bind'
import { observer } from 'mobx-react'
import { SigninStore } from './store'
import { withRouter } from 'react-router-dom'
import toasterStore from '../../base/Toaster/store'
import userStore from '../../base/userStore'

import './style.less'

@withRouter
@observer
export default class Signin extends Component {

  constructor() {
    super()
    this.store = new SigninStore()
  }

  @bind
  @toasterStore.handle('Permission Success!')
  handleClick() {
    const { history } = this.props
    const promise = this.store.auth()
    promise.then(
      () => userStore.fetch(),
    ).then(
      () => {
        if (userStore.isBrand) {
          setTimeout(() => history.push('/tokens'), 100)
        }
        if (userStore.isEnduser) {
          setTimeout(() => history.push('/enduser'), 100)
        }
      }
    )
    return promise
  }

  render() {
    return (
      <div className="comp-signin">
        <Button onClick={this.handleClick} loading={this.store.loadings.isLoading('auth')}>
          Sign In
        </Button>
      </div>
    )
  }
}
