import React from 'react'
import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import { observer } from 'mobx-react'
import store from './store'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import LayoutHeader from './Header'

import './style.less'
import logoSmall from '../../global/assets/miraco-logo-small.png'

const { Sider, Content } = Layout
const { Item } = Menu

@withRouter
@observer
export default class LayoutWrapper extends React.Component {

  toggle = () => {
    store.setCollapsed(!store.collapsed)
  }

  render() {
    return store && (
      <Layout className="comp-layout">
        <Sider
          trigger={null}
          collapsible
          collapsed={store.collapsed}
        >
          <div style={{color: '#fff', lineHeight: '60px', textAlign: 'center'}}>
            <img className="logo" src={logoSmall} alt="miraco.io logo" />
            {
              store.collapsed ? "" : <span className="logoDesc">miraco.io</span>
            }
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={[this.props.location.pathname]}>
            <Item key="/tokens">
              <Link to="/tokens">
                <Icon type="bold" theme="outlined" />
                <span>Tokens</span>
              </Link>
            </Item>
            <Item key="/transactions">
              <Link to="/transactions">
                <Icon type="export" theme="outlined" />
                <span>Transactions</span>
              </Link>
            </Item>
            {/* <Item key="/bills">
              <Link to="/bills">
                <Icon type="pay-circle" theme="outlined" />
                <span>Bill</span>
              </Link>
            </Item> */}
          </Menu>
          <div className="sider-bottom" onClick={store.toggle}>
            {
              store.collapsed
              ? <Icon type="double-right" theme="outlined" />
              : <Icon type="double-left" theme="outlined" />
            }
          </div>
        </Sider>
        <Layout>
          <LayoutHeader match={this.props.match}></LayoutHeader>
          <Content style={{ margin: '0px 0px', padding: 24, minHeight: 280 }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
