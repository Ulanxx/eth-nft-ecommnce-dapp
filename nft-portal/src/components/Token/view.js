import React from 'react'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Card from 'antd/lib/card'

import './style.less'


export function Overview({ species, transferredAmount, amount }) {
  return (
    <div className="comp-brand-overview">
      <Row type="flex" justify="center">
        <Col span={8}>
          <Card>
            <h1>{species || 0}</h1>
            <h6>Issued Tokens</h6>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <h1>{transferredAmount || 0}</h1>
            <h6>Total Distributed</h6>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="last-card">
            <h1>{amount || 0}</h1>
            <h6>Total Minted</h6>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
