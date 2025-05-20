export const routes = [
  { path: '/', redirect: '/homepage' },
  { path: '/homepage', component: '@/pages/homepage', title: '首页' },
  { path: '/calculate', component: '@/pages/calculate', title: '计算器' },
  {
    path: '/test',
    component: '@/pages/test',
    title: '测试模块',
    routes: [
      { path: '/test/calculate', component: '@/pages/calculate', title: '测试计算器' },
    ],
  },
  { path: '/userInfo', component: '@/pages/userInfo', title: '个人信息' },
]

export default [
  { path: '/login', component: '@/pages/login' },
  { path: '/h5login', component: '@/pages/login/h5login' },
  { path: '/register', component: '@/pages/register' },
  {
    path: '/',
    component: '@/pages/index',
    routes,
  },
]
