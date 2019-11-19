import React, { Component } from 'react'
import { observer } from 'mobx-react'
import validatorjs from 'validatorjs'
import MobxReactForm from 'mobx-react-form'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 16 },
  },
};

const plugins = { dvr: validatorjs }

const fields = [{
  name: 'companyName',
  label: 'Company Name',
  placeholder: 'Company Name',
  rules: 'required|string',
}, {
  name: 'publicAddress',
  label: 'Wallet Address',
  placeholder: 'Wallet Address',
  rules: 'required|string',
}]


@observer
export default class AddBrandOwner extends Component{

  form = new MobxReactForm(
    { fields },
    { plugins, hooks : {
      onSubmit: from => {
        if (from.isValid) {
          this.props.onOk(from)
        }
      }
    }
  })

  render() {
    return (
      <Modal
        title="New Issuer"
        visible={true}
        onOk={this.form.onSubmit}
        onCancel={this.props.onCancel}
        okText="Save"
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label={this.form.$('companyName').label}
            validateStatus={this.form.$('companyName').error ? 'error' : null}
            help={this.form.$('companyName').error}
          >
            <Input {...this.form.$('companyName').bind()} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.form.$('publicAddress').label}
            validateStatus={this.form.$('publicAddress').error ? 'error' : null}
            help={this.form.$('publicAddress').error}
          >
            <Input {...this.form.$('publicAddress').bind()} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}





