import React, { useState } from 'react'
import { Form, Input, Button, Tabs } from 'antd';
import EditInfo from './EditInfo';

const Index = () => {
  const [key, setkey] = useState('1')

  return (
    <>
      <Tabs activeKey={key} onChange={setkey} style={{ marginTop: '-10px' }}>
        <Tabs.TabPane tab="修改资料" key="1" />
        <Tabs.TabPane tab="修改密码" key="2" />
      </Tabs>
      {
        key === "1"
          ? <EditInfo />
          : key === "2"
            ? <></>
            : null
      }
    </>
  )
}

export default Index