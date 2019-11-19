import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { IssuerStore } from './store'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Divider from 'antd/lib/divider'
import AddIssuer from './Add'
import UpdateIssuer from './Update'
import Modal from 'antd/lib/modal'
import * as moment from 'moment'

import './style.less'

const Column = Table.Column

@observer
export default class BrandOwner extends Component {

  constructor() {
    super()
    this.store = new IssuerStore()
    this.store.list()
  }

  render() {
    return (
      <div className="comp-brand-owner">
        <Button type="primary" onClick={this.store.addModalStore.start}>Add New Isser</Button>
        <Table dataSource={this.store.issuers} rowKey="_id" loading={this.store.loadings.isLoading('list')}>
          <Column title="Issuer" dataIndex="userInfo.companyName" key="name"></Column>
          <Column title="Wallet Address" dataIndex="userInfo.publicAddress" key="publicAddress"></Column>
          <Column title="Contact" dataIndex="contactName" key="contactName"  render={contactName => <span>{contactName || '-'}</span>}></Column>
          <Column title="Email" dataIndex="contactEmail" key="contactEmail" render={contactEmail => <span>{contactEmail || '-'}</span>}></Column>
          <Column title="Mobile" dataIndex="contactPhoneNumber" key="contactPhoneNumber" render={contactPhoneNumber => <span>{contactPhoneNumber || '-'}</span>}></Column>
          <Column title="Updated Time" dataIndex="updatedAt" key="updatedAt" render={
            updatedAt => <span>{ updatedAt ? moment(updatedAt).format('MM-DD-YY HH:mm:SS') : '-'}</span>}
          >
          </Column>
          <Column title="Actions" key="op" dataIndex="_id" render={
            (id) =>
              <span>
                <a onClick={() => {
                  this.store.updateModalStore.start()
                  this.store.updateModalStore.setId(id)
                }}>Edit</a>
                <Divider type="vertical" />
                <a onClick={() => {
                  this.store.delModalStore.start()
                  this.store.delModalStore.setId(id)
                }}>Remove</a>
              </span>}
          ></Column>
        </Table>

        {
          this.store.addModalStore.active
          ? <AddIssuer
              onOk={this.store.addModalStore.onOk}
              onCancel={this.store.addModalStore.onCancel}
            >
            </AddIssuer>
          : null
        }

        {
          this.store.updateModalStore.active
          ? <UpdateIssuer
              issuer={this.store.currentIssuerForUpdate}
              onOk={this.store.updateModalStore.onOk}
              onCancel={this.store.updateModalStore.onCancel}
            >
            </UpdateIssuer>
          : null
        }
        <Modal
          title="Danger!!! Remove Isser"
          visible={this.store.delModalStore.active}
          onOk={this.store.delModalStore.onOk}
          onCancel={this.store.delModalStore.onCancel}
          okText="Remove"
          okType="danger"
        >
          <p>Make sure you do understand what you are doing! Please double confirm to remove this issuer</p>
        </Modal>
      </div>
    )
  }
}
