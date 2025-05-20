import { useState, useEffect, useCallback } from 'react'
import styles from './index.less';
import 'antd/dist/antd.css'
import { Button, Form, Input, InputNumber, message, Modal } from 'antd'
import { request } from 'umi';
import { getCalculateData, calculateAdd } from '@/services/index'

let timer: any = null

export default function IndexPage() {
  const [form] = Form.useForm();
  const [money, setmoney] = useState(0)

  // 获取当前时间
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  // 获取设备信息
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone/i.test(userAgent);
    return {
      userAgent,
      isMobile
    };
  };

  // 主函数，用于获取所有信息
  const getAllInfo = async () => {
    const currentTime = getCurrentTime();
    const deviceInfo = getDeviceInfo();
    // const ipAddress = await getIPAddress();

    return {
      currentTime,
      deviceInfo
    };
  };

  const getData = () => {
    getCalculateData()
      .then((data) => {
        console.log('全部列表', data);
      })
  }

  const AddData = (data: any) => {
    calculateAdd(data)
      .then((data) => {
        console.log('新增成功', data);
      }).catch((e) => {
        console.log(e)
      })
  }



  const onFinish = () => {
    form.validateFields().then((res) => {
      const salary = res.salary
      const secondSalary = salary / 22 / 9 / 60 / 60
      getAllInfo().then(info => {
        console.log('res', res, 'secondSalary', secondSalary, '重要信息', info)
        setmoney(0)
        changeSalary(secondSalary)
        AddData({ ...res, ...info, info: '这是填表的信息' })
      });
    }).catch((e) => {
      console.error(e)
    })
  };

  const changeSalary = (secondSalary: any) => {
    clearInterval(timer)
    timer = null
    timer = setInterval(() => {
      console.log('money', money)
      setmoney((money) => money + secondSalary)
    }, 1000)
  }

  const info = () => {
    getAllInfo().then(info => {
      AddData({ ...info, info: '这是进来就偷的信息', buryingPoint: true })
    })
    message.success('欢迎使用秒薪显示器！')
    // Modal.info({
    //   title: '你好',
    //   content: '欢迎使用秒薪显示器！',
    //   onOk: () => {
    //     return new Promise((resolve, reject) => {
    //       resolve('')
    //     })
    //   },
    //   onCancel: () => { }
    // })
  }


  useEffect(() => {
    info()
    // AddData()
    // getData()
  }, [])


  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <Form
        name="basic"
        form={form}
        colon={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={{}}
      >
        <Form.Item label=" ">
          <h1>秒薪计算器</h1>
        </Form.Item>
        <Form.Item
          label="月薪"
          name="salary"
          rules={[{ required: true, message: '请输入' }]}
          extra="按每月22个工作日，每天工作9小时"
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="姓名"
          name="name"
        // rules={[{ required: true, message: '请输入' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label=" ">
          <Button type="primary" onClick={() => { onFinish() }}>
            开始
          </Button>
          <Button style={{ marginLeft: '15px' }} onClick={() => { }}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ fontSize: 30 }}>
          {money}
        </div>
      </div>
    </div >
  );
}
