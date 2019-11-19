import React, { Component } from 'react'
import { observer } from 'mobx-react'
import validatorjs from 'validatorjs'
import MobxReactForm from 'mobx-react-form'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import { get } from 'lodash'

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
}, {
  name: 'contactName',
  label: 'Contact',
  placeholder: 'Contact Name'
}, {
  name: 'contactEmail',
  label: 'Email',
  placeholder: 'Email',
  rules: 'email'
}, {
  name: 'contactPhoneNumber',
  label: 'Mobile',
  placeholder: 'Mobile'
}]


@observer
export default class UpdateIssuer extends Component{

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

  componentDidMount() {
    const companyName = get(this.props, 'issuer.userInfo.companyName')
    const publicAddress = get(this.props, 'issuer.userInfo.publicAddress')
    const contactName = get(this.props, 'issuer.contactName')
    const contactEmail = get(this.props, 'issuer.contactEmail')
    const contactPhoneNumber = get(this.props, 'issuer.contactPhoneNumber')
    companyName && this.form.$('companyName').set(companyName)
    publicAddress && this.form.$('publicAddress').set(publicAddress)
    contactName && this.form.$('contactName').set(contactName)
    contactEmail && this.form.$('contactEmail').set(contactEmail)
    contactPhoneNumber && this.form.$('contactPhoneNumber').set(contactPhoneNumber)
  }

  render() {
    return (
      <Modal
        title="Update Issuer"
        visible={true}
        onOk={this.form.onSubmit}
        onCancel={this.props.onCancel}
        okText="Update"
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
          <FormItem
            {...formItemLayout}
            label={this.form.$('contactName').label}
            validateStatus={this.form.$('contactName').error ? 'error' : null}
            help={this.form.$('contactName').error}
          >
            <Input {...this.form.$('contactName').bind()} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.form.$('contactEmail').label}
            validateStatus={this.form.$('contactEmail').error ? 'error' : null}
            help={this.form.$('contactEmail').error}
          >
            <Input {...this.form.$('contactEmail').bind()} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.form.$('contactPhoneNumber').label}
            validateStatus={this.form.$('contactPhoneNumber').error ? 'error' : null}
            help={this.form.$('contactPhoneNumber').error}
          >
            <Input {...this.form.$('contactPhoneNumber').bind()} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}





