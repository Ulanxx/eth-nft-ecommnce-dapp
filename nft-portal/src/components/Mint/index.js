import React, { Component } from 'react'
import registerPermission from '../../base/permission'
import signinRequired from '../../base/permissions/signinRequire'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Card from 'antd/lib/card'
import Layout from '../Layout'
import { MintStore } from './store'
import { Variant } from './Variant'
import { UploadImage } from './Upload'
import Button from 'antd/lib/button'
import FormItem from '../../base/FormItem'
import Category from './Category'
import bind from '../../base/bind'

import './style.less'

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
}

const TextArea = Input.TextArea

@withRouter
@registerPermission(signinRequired)
@observer
export default class Mint extends Component {

  componentDidMount() {
    this.store.uploadStore.uploadToken();
  }

  store = new MintStore();

  @bind
  handleMint() {
    this.store.mint()
      .then(
        () => this.props.history.push('/tokens')
      )
  }

  render() {

    const form = this.store.form;

    return (
      <Layout>
        <div className="comp-mint">
          <Card title="Token Information">
            <Row>
              <Col span={10}>
                <FormItem
                  {...formItemLayout}
                  field={form.$('name')}
                >
                  <Input {...form.$('name').bind()} autoComplete="off"></Input>
                </FormItem>
              </Col>
              <Col span={1}></Col>
              <Col span={10}>
                <FormItem
                  {...formItemLayout}
                  field={form.$('symbol')}
                >
                  <Input {...form.$('symbol').bind()} autoComplete="off"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form>
                  <FormItem
                    {...formItemLayout}
                    field={form.$('url')}
                  >
                    <UploadImage store={this.store.uploadStore}/>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Card>
          <Card title="Product Information">
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                field={form.$('brand')}
              >
                <Input {...form.$('brand').bind()} autoComplete="off"></Input>
              </FormItem>
              <FormItem
                {...formItemLayout}
                field={form.$('description')}
              >
                <TextArea {...form.$('description').bind()} autoComplete="off"></TextArea>
              </FormItem>
            </Col>
            <Col span={1}>

            </Col>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                field={form.$('title')}
              >
                <Input {...form.$('title').bind()} autoComplete="off"></Input>
              </FormItem>
              <FormItem {...formItemLayout} field={form.$('category')}>
                <Category {...form.$('category').bind()}></Category>
              </FormItem>
            </Col>
          </Card>

          <Card title="Variants">
            <Variant store={this.store.variantStore}></Variant>
          </Card>

          <footer className="comp-mint-footer">
            <span>Total:</span><span>{this.store.variantStore.total}</span>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
              loading={this.store.loadings.isLoading('mint')}
              onClick={this.handleMint}
            >Start Mint</Button>
          </footer>
        </div>
      </Layout>
    )
  }
}




