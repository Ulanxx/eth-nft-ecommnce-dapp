import React from "react";
import Button from 'antd/lib/button'
import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import Modal from 'antd/lib/modal'
import { observer } from "mobx-react/index";

export const UploadImage = observer(({ store }) => {

  const upProp = {
    name: 'file',
    accept: 'image/*',
    action: store.action,
    listType: 'picture',
    data: { token: store.token },
    showUploadList: false,
    onChange({ file }) {
      if (file.response && file.status === 'done') {
        store.setUploadUrl(`${store.upload_prefix}/${file.response.hash}`)
      }
    }
  };
  return (
    <div>
      <Upload {...upProp}>
        <Button type="primary" ghost="true">
          <Icon type="upload"/>Upload
        </Button>
      </Upload>
      {
        store.url && <div>
          <img src={store.url} width={100} height={'auto'} style={{ marginTop: 10 }} alt={''} onClick={() => {
            store.setModalVisible(true)
          }}/>
          <Modal
            visible={store.modalVisible}
            footer={null}
            maskClosable={true}
            centered={true}
            onCancel={() => {
              store.setModalVisible(false)
            }}
            bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <img src={store.url} width={300} height={'auto'} style={{ marginTop: 10 }} alt={''}/>
          </Modal>
        </div>
      }
    </div>
  )
});
