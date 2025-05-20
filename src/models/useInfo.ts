import { useState, useCallback, useMemo } from 'react';
import { getUserInfo } from '@/services'
import { history } from 'umi'
import { message } from 'antd'

export default function useInfo() {

  const [info, setinfo] = useState<any>({
    name: '',
    id: ''
  });

  const setInfo = useCallback((data) => {
    setinfo(data);
  }, []);

  const initUser = async () => {
    await getUserInfo().then((res) => {
      // console.log('userInfo', res)
      if (res.id) {
        setinfo(res)
      } else {
        message.error('请先登录后再操作')
        history.push({ pathname: 'login' })
      }
    }).catch((e) => {
      message.error('请先登录后再操作')
      history.push({ pathname: 'login' })
    })
  }

  return {
    info,
    setInfo,
    initUser,
  };
}
