const http = require('http');
const requestProcess = require('./request/index')


const server = http.createServer((req, res) => {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  requestProcess(req, res)

});

const config = {
  // '127.0.0.1'表明只有本机可访问，'0.0.0.0'表示所有人可访问
  hostname: '0.0.0.0',
  // hostname: '127.0.0.1',
  port: '3001'
};
server.listen(config.port, () => {
  console.log(`Server running at <a href="http://${config.hostname}:${config.port}/data`);
});