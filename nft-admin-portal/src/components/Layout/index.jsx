import React from 'react'
import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import { observer } from 'mobx-react'
import store from './store'

import './style.less'
import logoSmall from '../../global/assets/miraco-logo-small.png'

const { Header, Sider, Content } = Layout
const { Item } = Menu

@observer
export default class SiderDemo extends React.Component {

  toggle = () => {
    store.setCollapsed(!store.collapsed)
  }

  render() {
    return store && (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={store.collapsed}
        >
          <div style={{color: '#fff', lineHeight: '60px', textAlign: 'center'}}>
          <img className="logo" src={logoSmall} alt="miraco.io logo" />&nbsp;&nbsp;miraco.io
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['suppliers']}>
            <Item key="suppliers">
              <Icon type="shopping" theme="outlined" />
              <span>Issuers Mgmt.</span>
            </Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
