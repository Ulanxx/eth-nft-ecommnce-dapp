import React, { Component } from 'react'
import registerPermission from '../../base/permission'
import signinRequired from '../../base/permissions/signinRequire'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { TransferStore } from './store'
import Table from 'antd/lib/table'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Select from 'antd/lib/select'
import Card from 'antd/lib/card'
import Layout from '../Layout'
import { StartDate, EndDate } from './DatePicker'
import Tag from 'antd/lib/tag'
import { statusMapColor, statusMapText } from './constants'
import { reaction } from 'mobx'
import { debounce } from 'lodash'
import { parse, stringify } from '../../base/query-string'

import './style.less'


const Column = Table.Column
const Option = Select.Option


const transferStore = new TransferStore()
const listdDebounced = debounce(() => transferStore.listTransferHistory(), 100)

@withRouter
@registerPermission(signinRequired)
@observer
export default class Transfer extends Component {

  store = transferStore

  componentDidMount() {

    const { location, history } = this.props
    const query = parse(location.search)
    // null 代表 全部
    this.store.setSelectedSymbol(query.symbolId || null)
    this.store.listSymbols()

    reaction(
      () => this.store.query,
      () => listdDebounced(),
      { fireImmediately: true }
    )

    reaction(
      () => [this.store.selectedSymbol],
      ([symbolId]) => {
        history.replace(`/transfers?${stringify({ symbolId })}`)
      }
    )
  }

  render() {
    return (
      <Layout>
        <div className="comp-transfer">
          <Card>
            <Row>
              <Col span={6}>
                Symbol：&nbsp;&nbsp;
                <Select value={this.store.selectedSymbol} onChange={this.store.setSelectedSymbol}
                        style={{ minWidth: '120px' }}>
                  {
                    this.store.symbolsForSelector.map(
                      symbol => <Option key={symbol.value} value={symbol.value}>{symbol.symbol}</Option>
                    )
                  }
                </Select>
              </Col>
              <Col span={18}>
                Date Range：&nbsp;&nbsp;
                <StartDate
                  value={this.store.startDate}
                  onChange={this.store.setStartDate}
                  endDate={this.store.endDate}
                >
                </StartDate>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <EndDate
                  startDate={this.store.startDate}
                  value={this.store.endDate}
                  onChange={this.store.setEndDate}>
                </EndDate>
              </Col>
            </Row>
          </Card>
          <Card title="Transactions History">
            <Table rowKey="_id" dataSource={this.store.listForDisplay}
                  loading={this.store.loadings.isLoading('list')}>
              <Column width="100px" title="Token ID" key="tokenId" dataIndex="tokenId" align='center'></Column>
              <Column width="100px" title="Symbol" key="symbol" dataIndex="symbol" align='center'></Column>
              <Column width="200px" title="Token Name" key="tokenName" dataIndex="tokenName" align='center'></Column>
              <Column title="TxHash" key="txHash" dataIndex="txHash" align='center'></Column>
              <Column title="From" key="from" dataIndex="from" align='center'></Column>
              <Column title="To" key="to" dataIndex="to" align='center'></Column>
              <Column width="150px" title="Timestamp" key="timestamp" dataIndex="timestamp" align='center'></Column>
              <Column title="Status" key="status" dataIndex="status" align='center' render={
                status => <Tag color={statusMapColor[status]}>{statusMapText[status]}</Tag>
              }></Column>
            </Table>
          </Card>
        </div>
      </Layout>
    )
  }
}
