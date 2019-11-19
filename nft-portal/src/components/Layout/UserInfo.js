import React from 'react'
import Menu from 'antd/lib/menu'
import Dropdown from 'antd/lib/dropdown'
import Icon from 'antd/lib/icon'
import userStore from '../../base/userStore'
import { observer } from 'mobx-react'

const Item = Menu.Item

const menu = (
  <Menu>
    <Item>
      <a onClick={userStore.signout}>Signout</a>
    </Item>
  </Menu>
);

export default observer(() => (
  <Dropdown overlay={menu} trigger={['click']}>
    <a>
      {userStore.companyName} <Icon type="down" />
    </a>
  </Dropdown>
))
