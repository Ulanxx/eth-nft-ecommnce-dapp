import React from 'react'
import Layout from 'antd/lib/layout'
import Breadcrumb from 'antd/lib/breadcrumb'
import { pathNameMapBreadcrumb } from './constants'
import { Link } from 'react-router-dom'
import UserInfo from './UserInfo'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

const Header = Layout.Header
const Item = Breadcrumb.Item

export default ({ match }) => {
  const path = match.path

  const breadcrumbs = pathNameMapBreadcrumb[path]
  return (
    <Header style={{ background: '#fff', padding: 0 }}>
      <Row type="flex" justify="space-between">
        <Col span={4}>
          <Breadcrumb>
            {
              breadcrumbs && breadcrumbs.map(
                (breadcrumb, index) => (
                  <Item key={breadcrumb.path}>
                    {
                      breadcrumbs.length === index + 1
                      ? <span>{breadcrumb.name}</span>
                      : <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
                    }
                  </Item>
                )
              )
            }
          </Breadcrumb>
        </Col>
        <Col span={4} style={{ textAlign: 'right', paddingRight: '20px' }}>
          <UserInfo></UserInfo>
        </Col>
      </Row>
    </Header>
  )
}
