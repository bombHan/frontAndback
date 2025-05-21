
import { request } from 'umi'
const url = 'https://b9ae-59-125-62-188.ngrok-free.app'
// const url = 'http://0.0.0.0:3001'

export const login = (data: any) => {
  return request(`${url}/user/login`, {
    method: 'post', data
  })
}

export const register = (data: any) => {
  return request(`${url}/user/register`, {
    method: 'post', data
  })
}

export const editUser = (data: any) => {
  return request(`${url}/user/edit`, {
    method: 'post', data
  })
}

export const getUserInfo = () => {
  return request(`${url}/user/info`, {
    method: 'get',
    params: {
      id: localStorage.getItem('userId')
    }
  })
}

export const getCalculateData = () => {
  return request(`${url}/calculate/data`, {
    method: 'get'
  })
}

export const calculateAdd = (data: any) => {
  return request(`${url}/calculate/data`, {
    method: 'post', data
  })
}

