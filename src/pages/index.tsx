import React, { useEffect, useMemo, useState } from 'react'
import { useModel, history } from 'umi'
import { Breadcrumb, Layout, Menu, Avatar, Popover, Divider, Space } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import logo from '@/assets/logo.png'
import { routes } from '../../config/.umirc.routes'
import './index.less'

const { Header, Content, Sider } = Layout;

const Index = (props: any) => {
  const { info, initUser } = useModel('useInfo')
  const [selectedKeys, setselectedKeys] = useState<any[]>([])

  const getMenuItems = (list: any[]) => {
    return list.map((item) => {
      const newItem: any = {
        label: item.title,
        key: item.path
      }
      if (item.routes) {
        newItem.children = getMenuItems(item.routes)
      }
      return newItem
    })
  }

  const menuItems: any = useMemo(() => {
    let items = routes.filter((item) => !!item.title)
    items = getMenuItems(items)
    // console.log('初始化菜单routes', routes, 'items', items)
    return items
  }, [routes])

  const getSelectMenuItem = (list: any[], labelList = []) => {
    let target: any = { labelList: [] }
    list.forEach(item => {
      // console.log(item.key, selectedKeys[0], item.key === selectedKeys[0], labelList, item.label)
      if (item.key === selectedKeys[0]) {
        target = {
          ...item,
          labelList: labelList.concat(item)
        }
        // console.log(target)
      }
      if (item.children) {
        const t: any = getSelectMenuItem(item.children, labelList.concat(item))
        if (t.label) {
          target = t
          // console.log(target)
        }
      }
    });
    return target
  }

  const menuOnClick = ({ item, key, keyPath, domEvent }: any) => {
    // console.log(item, key, keyPath, domEvent, 'history', history)
    if (history.location.pathname !== key) {
      setselectedKeys([key])
      history.push({ pathname: key })
    }
  }


  // console.log(info)
  const init = async () => {
    setselectedKeys([history.location.pathname])
    await initUser()
  }

  useEffect(() => {
    init()
  }, [])

  // console.log('info', info)
  // console.log(getSelectMenuItem(menuItems))
  return (
    <>
      {
        info.id && <Layout className='layout'>
          <Header className="header">
            <img src={logo} />
            <div>
              <Popover
                placement="bottomRight"
                content={<div style={{ width: '150px' }}>
                  <div
                    className='user-item'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      history.push({ pathname: '/userInfo' })
                      setselectedKeys(['/userInfo'])
                    }}
                  >
                    个人信息
                  </div>
                  <Divider type="horizontal" style={{ margin: '10px 0' }} />
                  <div
                    className='user-item'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      window.localStorage.clear()
                      history.push({ pathname: '/login' })
                    }}
                  >
                    退出
                  </div>
                </div>}
                title={
                  <div style={{ height: 30, lineHeight: '30px' }}>
                    <b>{info.name}</b>
                  </div>
                }
                trigger="hover"
              >
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {info.name}
                </Avatar>
              </Popover>
            </div>
          </Header>
          <Layout>
            <Sider style={{ display: !!getSelectMenuItem(menuItems).key ? undefined : 'none' }} width={250}>
              <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
                onClick={menuOnClick}
              />
            </Sider>
            <Layout style={{ padding: '20px' }}>
              <Breadcrumb style={{ margin: '0 0 15px 0' }}>
                <Breadcrumb.Item
                  className='bread-item'
                  onClick={() => { setselectedKeys(['/homepage']); history.push({ pathname: '/homepage' }) }}
                >
                  <HomeOutlined style={{ marginRight: 5 }} />
                  首页
                </Breadcrumb.Item>
                {
                  selectedKeys[0] !== '/homepage' && (getSelectMenuItem(menuItems).labelList || []).map((item: any, index: number) => {
                    return <Breadcrumb.Item key={index}>{item.label}</Breadcrumb.Item>
                  })

                }
              </Breadcrumb>
              <Content
                style={{
                  padding: 20,
                  margin: 0,
                  minHeight: 280,
                  background: '#fff'
                }}
              >
                {props.children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      }

    </>
  )
}

export default Index