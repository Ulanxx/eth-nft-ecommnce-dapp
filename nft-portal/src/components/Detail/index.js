import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import registerPermission from '../../base/permission';
import signinRequired from '../../base/permissions/signinRequire';
import { DetailStore } from './store';
import Table from 'antd/lib/table';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';
import Card from 'antd/lib/card';
import Skeleton from 'antd/lib/skeleton';
import { get } from 'lodash';
import Tag from 'antd/lib/tag';
import { statusMapColor, statusMapText } from './constants';
import A from '../../base/A';
import { shouldForbid } from './transforms';
import Transfer from '../Token/Transfer';
import DEFAULT_ICON from '../../global/assets/default-token-icon.png';
import Layout from '../Layout';
import bind from '../../base/bind';

import './style.less';

const Column = Table.Column;

@withRouter
@registerPermission(signinRequired)
@observer
export default class Detail extends Component {
  store = new DetailStore();

  dom = null;

  @bind
  setDom(dom) {
    this.dom = ReactDOM.findDOMNode(dom);
  }

  componentDidMount() {
    const id = get(this.props, 'match.params.id');
    this.store.listTokensWithLoding(id);
    this.clearCode = setInterval(() => this.store.listTokens(id), 5 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.clearCode);
  }

  render() {
    return (
      <Layout>
        <div className="comp-detail">
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {this.store.loadings.isLoading('list') ? null : (
                  <img
                    src={this.store.overview.url || DEFAULT_ICON}
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                  />
                )}
                <span style={{ marginLeft: 5, color: '#323232' }}>
                  {this.store.overview.symbol}
                </span>
              </div>
            }
          >
            {this.store.loadings.isLoading('list') ? (
              <Skeleton title={false} paragraph={{ rows: 3 }}></Skeleton>
            ) : (
              <Overview store={this.store}></Overview>
            )}
          </Card>

          <Card title="Individual Token List" ref={this.setDom}>
            <Table
              dataSource={this.store.tokensForDisplay}
              rowKey="_id"
              loading={this.store.loadings.isLoading('list')}
            >
              <Column title="Token ID" dataIndex="tokenId" align="center" />
              <Column title="Variant" dataIndex="variant" align="center" />
              <Column
                title="Price"
                dataIndex="price"
                align="center"
                render={(price, recode) => <span>${price}</span>}
              />
              <Column title="SKU" dataIndex="sku" align="center" />
              <Column
                title="Status"
                dataIndex="status"
                align="center"
                render={status => (
                  <Tag color={statusMapColor[status]}>
                    {statusMapText[status]}
                  </Tag>
                )}
              ></Column>
              <Column
                title="Action"
                key="action"
                dataIndex="tokenId"
                align="center"
                render={(tokenId, record) => (
                  <A
                    shouldForbid={shouldForbid(record)}
                    popupContainerDOM={this.dom}
                    onClick={() => {
                      this.store.transferStore.setId(tokenId);
                      this.store.transferStore.start();
                    }}
                  >
                    {!shouldForbid(record) ? (
                      <Tooltip
                        placement="top"
                        title="Transfer"
                        arrowPointAtCenter={true}
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
            {this.store.transferStore.active ? (
              <Transfer
                token={this.store.currentTokenForTransfer}
                onOk={this.store.transferStore.onOk}
                onCancel={this.store.transferStore.onCancel}
              ></Transfer>
            ) : null}
          </Card>
        </div>
      </Layout>
    );
  }
}

function Overview({ store }) {
  return (
    <div>
      <Row>
        <Col span={3} />
        <Col span={9}>
          <div className={'card-item-container'}>
            <span>Name ：</span>
            <p>{store.overview.name}</p>
          </div>
        </Col>
        <Col span={3} />
        <Col span={9}>
          <div className={'card-item-container'}>
            <span>Title ：</span>
            <p>{store.overview.title}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={3} />
        <Col span={9}>
          <div className={'card-item-container'}>
            <span>Category ：</span>
            <p>{store.overview.category}</p>
          </div>
        </Col>
        <Col span={3} />
        <Col span={9}>
          <div className={'card-item-container'}>
            <span>Brand ：</span>
            <p>{store.overview.brand}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={3} />
        <Col span={9}>
          <div className={'card-item-container'}>
            <span>Description ：</span>
            <p>{store.overview.description}</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
