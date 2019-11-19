import React, { Component } from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import message from 'antd/lib/message'
import toasterStore from './store'

// delay for 5s, then disappear
const delay = 5

@observer
export default class Toaster extends Component {

  componentDidMount() {
    autorun(() => {
      const item = toasterStore.current
      if (!item) return
      message[item.type](item.title, delay)
    })
  }

  render() {
    return (
      <div>
      </div>
    )
  }

}
