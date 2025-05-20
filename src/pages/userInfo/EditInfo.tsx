import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import logo from '@/assets/logo.png'
import { editUser } from '@/services/index'
import { useModel } from 'umi'

const EditInfo = () => {
  const { info, initUser } = useModel('useInfo')
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }
  ])

  const onFinish = (values: any) => {
    console.log('请求入参', values, info.id, fileList);
    editUser({ ...values, id: info.id }).then((res) => {
      console.log('res', res)
      if (res.success) {
        message.success(res.message)
        initUser()
      }
    }).catch((e) => { })
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    console.log('onChange中newFileList', newFileList)
    setFileList(newFileList);
  }


  const init = () => {
    console.log('初始化个人信息', info)
    form.setFieldsValue({
      ...info
    })
  }

  useEffect(() => {
    init()
  }, [])
  return (
    <div>
      <Form
        form={form}
        style={{ margin: '20px' }}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        colon={false}
      >
        <Form.Item
          label="姓名"
          name="name"
        // rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="账号"
          name="account"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          label="头像"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            accept=".png,.jpg,.jpeg"
            fileList={fileList}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item> */}




        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditInfo