import { defineConfig } from 'umi';
const target = 'http://0.0.0.0:3001/'
import routes from './config/.umirc.routes'

export default defineConfig({
  base: '/',
  publicPath: `./`,
  favicon: '/icon.gif',
  proxy: {
    // '/': {
    //   target,
    //   // pathRewrite: {'^/platformConfig': ''},
    //   changeOrigin: true,
    // },
    '/data': {
      target,
      // pathRewrite: {'^/platformConfig': ''},
      changeOrigin: true,
    },
    '/user': {
      target,
      // pathRewrite: {'^/platformConfig': ''},
      changeOrigin: true,
    }
  },
  nodeModulesTransform: {
    type: 'none',
  },
  history: { type: 'hash' },
  title: '平台',
  routes,
  fastRefresh: {},
});
