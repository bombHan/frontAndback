
const url = require('url');
const fs = require('fs');
const path = require('path');

// 数据文件路径
const dataFilePath = path.join(__dirname, './data.json');
// 从文件中读取数据
function readDataFromFile () {
  try {
    const dataObj = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(dataObj);
  } catch (error) {
    return [];
  }
}

// 将数据写入文件
function writeDataToFile (newValue) {
  const newData = {
    ...readDataFromFile(),
    ...newValue
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
}

function getClientIp (req) {
  // 优先从 X-Forwarded-For 获取（反向代理场景）
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // 直接连接场景
  let ip = req.socket.remoteAddress;
  // 转换 IPv6 格式的 IPv4 地址
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip;
}

// 初始化数据
let jsonObj = readDataFromFile();
let list = jsonObj.list
let flag = jsonObj.flag

const request = (req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const ip = getClientIp(req)
  const pathList = [
    '/user/info',
    '/user/login',
    '/user/register',
    '/user/edit'
  ]
  // console.log('parsedUrl', parsedUrl, 'id', id, 'ip', ip)
  // console.log('req.headers', req.headers)

  if (pathList.includes(path)) {
    if (req.method === 'GET') {
      console.log('parsedUrl.query', parsedUrl.query)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const id = parsedUrl.query.id
      // console.log('list', list, 'id', id)
      let targetUser = list.find(item => item.id === id)
      targetUser = { ...targetUser }
      if (targetUser) {
        delete targetUser.password
      }
      res.end(JSON.stringify(targetUser));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        console.log('JSON.parse(body)', JSON.parse(body))
        const params = JSON.parse(body)
        let result = { success: false, errorMessage: '系统报错' }

        // 不同的接口请求处理
        if (path === pathList[0]) {
          // 查询用户信息
          let targetUser = list.find(item => item.id === params.id)
          targetUser = { ...targetUser }
          if (targetUser) {
            delete targetUser.password
            result = { success: true, message: '查询成功', ...targetUser }
          } else {
            result = { success: false, errorMessage: '登录失败' }
          }
        } else if (path === pathList[1]) {
          // 登录
          const targetUser = list.find((item) => { return item.account === params.account || item.phone === params.account })
          console.log('targetUser', targetUser)
          if (targetUser && targetUser.password === params.password) {
            result = { success: true, message: '登录成功', id: targetUser.id }
          } else {
            result = { success: false, errorMessage: '登录失败' }
          }
        } else if (path === pathList[2]) {
          // 注册
          const targetUser = list.find((item) => { return item.phone === params.phone })
          if (targetUser) {
            result = { success: false, errorMessage: '注册失败，该手机号已存在' }
          } else {
            const newUser = {
              id: `${Math.floor(Math.random() * 100000000)}-${flag}`,
              account: params.phone,
              name: `${flag}user`,
              ...params,
              loginTimeList: []
            }
            console.log('注册newUser', newUser)
            list = list.concat(newUser)
            flag += 1
            result = { success: true, message: '注册成功', newUser }
            writeDataToFile({ list, flag });
          }
        } else if (path === pathList[3]) {
          // 修改信息
          let targetIndex = -1
          const targetUser = list.find((item, index) => { targetIndex = index; return item.id === params.id })
          if (targetUser) {
            const newUser = {
              ...targetUser,
              ...params
            }
            console.log('修改信息newUser', newUser)
            list[targetIndex] = newUser
            result = { success: true, message: '修改成功', newUser }
            writeDataToFile({ list, flag });
          } else {
            result = { success: false, errorMessage: '修改失败，当前用户不存在' }
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
}

exports = module.exports = request;

