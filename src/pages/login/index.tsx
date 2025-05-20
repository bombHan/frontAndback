import React from 'react'
import { Breadcrumb, Layout, Menu, Avatar, Form, Input, Button, message } from 'antd';
import logo from '@/assets/logo.png'
import { login } from '@/services/index'
import { history } from 'umi'
import { QRCodeSVG } from 'qrcode.react';


const { Header, Content, Sider } = Layout;

const Index = () => {

  const onFinish = (values: any) => {
    console.log('登录请求入参', values);
    login(values).then((res) => {
      console.log('res', res)
      if (res.success) {
        message.success(res.message)
        localStorage.setItem('userId', res.id)
        history.push({ pathname: 'homepage' })
      }
    }).catch((e) => { })
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Layout className='layout'>
      <Header className="header">
        <img src={logo} />
      </Header>
      <Layout>
        <Layout style={{ padding: '20px', background: '#fff', }}>
          <div style={{ margin: '200px auto 0', width: 400 }}>
            <QRCodeSVG value="https://reactjs.org/" />
            <h1
              style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}
            >
              系统登录
            </h1>
            <Form
              style={{ width: '100%' }}
              name="basic"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              colon={false}
            >
              <Form.Item
                // label="账号"
                name="account"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input addonBefore="账号" />
              </Form.Item>

              <Form.Item
                // label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password addonBefore="密码" />
              </Form.Item>
              {/* 
            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

              <Form.Item >
                <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                  点击登录
                </Button>
              </Form.Item>
            </Form>
            <div style={{ display: 'flex', flexDirection: 'row-reverse', margin: '20px 0' }}>
              <span>还没账号？<a onClick={() => { history.push({ pathname: 'register' }) }}>去注册</a></span>
            </div>
          </div>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default Index