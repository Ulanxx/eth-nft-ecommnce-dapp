import React, { Component } from 'react';
import * as moment from 'moment';
import registerPermission from '../../base/permission';
import signinRequired from '../../base/permissions/signinRequire';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Overview } from './view';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';
import { TokenStore } from './store';
import { Link } from 'react-router-dom';
import Transfer from './Transfer';
import A from '../../base/A';
import { shouldForbid } from './transforms';
import DEFAULT_ICON from '../../global/assets/default-token-icon.png';
import Layout from '../Layout';

import './style.less';
import bind from '../../base/bind';
import ReactDOM from 'react-dom';

const Column = Table.Column;

@withRouter
@registerPermission(signinRequired)
@observer
class Brand extends Component {
  store = new TokenStore();

  dom = null;

  @bind
  setDom(dom) {
    this.dom = ReactDOM.findDOMNode(dom);
  }

  clearCode = setInterval(this.store.listTokens, 5 * 1000);

  componentDidMount() {
    this.store.listTokensWithLoading();
  }

  componentWillUnmount() {
    clearInterval(this.clearCode);
  }

  render() {
    return (
      <Layout>
        <div>
          <Overview
            amount={this.store.tokenAmount}
            transferredAmount={this.store.tokenTransferredAmount}
            species={this.store.tokenSpecies}
          ></Overview>

          <div className="comp-brand">
            <Card
              ref={this.setDom}
              headStyle={{ color: '#343434' }}
              title="Issued Tokens List"
              extra={
                <Link to="tokens/mint">
                  <Button
                    align="right"
                    type="primary"
                    style={{ float: 'right' }}
                  >
                    Issue a new token
                  </Button>
                </Link>
              }
            >
              <Table
                rowKey="id"
                dataSource={this.store.listForDisplay}
                loading={this.store.loadings.isLoading('list')}
              >
                <Column
                  align="center"
                  title="Icon"
                  key="icon"
                  dataIndex="url"
                  render={(url, record) => (
                    <img
                      src={url || DEFAULT_ICON}
                      style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                  )}
                />
                <Column
                  align="center"
                  title="Symbol"
                  key="symbol"
                  dataIndex="symbol"
                  render={(symbol, record) => (
                    <Link to={`/tokens/${record.id}`}>{symbol}</Link>
                  )}
                ></Column>
                <Column
                  align="center"
                  title="Token Name"
                  key="name"
                  dataIndex="name"
                />
                <Column
                  align="center"
                  title="Title"
                  key="title"
                  dataIndex="title"
                />
                <Column
                  align="center"
                  title="Available VS. Supply"
                  key="ds"
                  render={(text, record) => (
                    <span>
                      {record.available} / {record.amountSupply}{' '}
                    </span>
                  )}
                ></Column>
                <Column
                  align="center"
                  title="Minted Date"
                  key="mintedDate"
                  dataIndex="mintedDate"
                  render={mintedDate => (
                    <span>
                      {moment(mintedDate).format('MM-DD-YY HH:mm:SS')}
                    </span>
                  )}
                />
                <Column
                  title="Status"
                  key="status"
                  dataIndex="symbolId"
                  align="center"
                  render={(symbolId, record) => (
                    <div>
                      {record.amountTransferring ? (
                        <div className="status">
                          <Link
                            to={{
                              pathname: '/transfers',
                              search: `?symbolId=${symbolId}`
                            }}
                          >
                            {record.amountTransferring} tokens are transferring
                          </Link>
                          <Icon type="loading" style={{ marginLeft: 5 }} />
                        </div>
                      ) : record.amountMinting ? (
                        <div className="status">
                          {record.amountMinting} tokens are minting
                        </div>
                      ) : record.available === 0 ? (
                        <div className="status">Unavailable</div>
                      ) : (
                        <div className="status-ready">Ready</div>
                      )}
                    </div>
                  )}
                ></Column>
                <Column
                  align="center"
                  title="Action"
                  key="action"
                  dataIndex="id"
                  render={(id, record) => (
                    <A
                      shouldForbid={shouldForbid(record)}
                      popupContainerDOM={this.dom}
                      onClick={() => {
                        this.store.modalStore.setId(id);
                        this.store.modalStore.start();
                      }}
                    >
                      {' '}
                      {!shouldForbid(record) ? (
                        <Tooltip
                          arrowPointAtCenter={true}
                          placement="top"
                          title="Transfer"
                          getPopupContainer={() => this.dom}
                        >
                          <Icon type="swap" style={{ fontSize: 15 }} />
                        </Tooltip>
                      ) : (
                        <Icon type="swap" style={{ fontSize: 15 }} />
                      )}
                    </A>
                  )}
                />
              </Table>
              {this.store.modalStore.active ? (
                <Transfer
                  variants={this.store.currentBatchForTransfer.variants}
                  available={this.store.currentBatchForTransfer.available}
                  onOk={this.store.modalStore.onOk}
                  onCancel={this.store.modalStore.onCancel}
                ></Transfer>
              ) : null}
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Brand;
