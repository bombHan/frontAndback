import React from 'react'
import { Breadcrumb, Layout, Menu, Avatar, Form, Input, Button, message } from 'antd';
import logo from '@/assets/logo.png'
import { register } from '@/services/index'
import { history, useModel } from 'umi'


const { Header, Content, Sider } = Layout;

const Index = () => {

  const onFinish = (values: any) => {
    console.log('请求入参', values);
    register(values).then((res) => {
      console.log('res', res)
      if (res.success) {
        message.success(res.message)
        localStorage.setItem('userId', res.newUser.id)
        history.push({ pathname: 'homepage' })
      }
    }).catch((e) => { })
  };

  return (
    <Layout className='layout'>
      <Header className="header">
        <img src={logo} />
      </Header>
      <Layout>
        <Layout style={{ padding: '20px', background: '#fff', }}>
          <div style={{ margin: '200px auto 0', width: 400 }}>
            <h1
              style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}
            >
              账号注册
            </h1>
            <Form
              style={{ width: '100%' }}
              name="basic"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
              colon={false}
            >
              <Form.Item
                name="name"
              // rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input addonBefore={<>姓名</>} />
              </Form.Item>
              <Form.Item
                name="account"
              >
                <Input addonBefore={<>账号</>} />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input addonBefore={<><span style={{ color: 'red' }}>*</span>手机号</>} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password addonBefore={<><span style={{ color: 'red' }}>*</span>密码</>} />
              </Form.Item>

              <Form.Item >
                <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                  点击注册
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default Index