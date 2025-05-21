import React, { RefObject } from 'react'
import {
  Form,
  Input,
  Button,
  Dialog,
  TextArea,
  DatePicker,
  Selector,
  Slider,
  Stepper,
  Switch,
  PasscodeInput
} from 'antd-mobile/es'

export default () => {
  const onFinish = (values: any) => {
    console.log('values', values)
    // Dialog.alert({
    //   content: <div>
    //     123
    //   </div>,
    // })
  }

  return (
    <>
      <Form
        layout='horizontal'

        onFinish={onFinish}
        footer={
          <Button block type='submit' color='primary' size='large'>
            提交
          </Button>
        }
      >
        <Form.Header>扫码登录</Form.Header>
        <Form.Item
          name='name'
          label='姓名'
        >
          <Input placeholder='请输入姓名' />
        </Form.Item>
        <Form.Item
          name="account"
          label='账号'
        >
          <Input placeholder='请输入账号' />
        </Form.Item>
        <Form.Item
          name="phone"
          label='手机号'
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input placeholder='请输入手机号' />
        </Form.Item>
        <Form.Item
          name="password"
          label='密码'
        // rules={[{ required: true, message: '请输入密码' }]}
        >
          <PasscodeInput plain />
        </Form.Item>

      </Form>
    </>
  )
}