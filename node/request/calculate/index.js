
const url = require('url');
const fs = require('fs');
const path = require('path');

// 数据文件路径
const dataFilePath = path.join(__dirname, './data.json');
const buryingPointDataFilePath = path.join(__dirname, './buryingPoint.json');

// 从文件中读取数据
function readDataFromFile () {
  try {
    const dataObj = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(dataObj);
  } catch (error) {
    return [];
  }
}

// 埋点从文件中读取数据
function readDataFromFileB () {
  try {
    const dataObj = fs.readFileSync(buryingPointDataFilePath, 'utf8');
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

// 埋点将数据写入文件
function writeDataToFileB (newValue) {
  const newData = {
    ...readDataFromFileB(),
    ...newValue
  }
  fs.writeFileSync(buryingPointDataFilePath, JSON.stringify(newData, null, 2), 'utf8');
}


// 初始化数据
let jsonObj = readDataFromFile();
let list = jsonObj.list
let flag = jsonObj.flag

let jsonObjB = readDataFromFileB();
let listB = jsonObjB.listB
let flagB = jsonObjB.flagB

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

const request = (req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const id = parseInt(parsedUrl.query.id);
  const ip = getClientIp(req)
  // console.log('parsedUrl', parsedUrl, 'id', id, 'ip', ip)

  if (path === '/calculate/data') {
    if (id) {
      const itemIndex = list.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        if (req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(list[itemIndex]));
        } else if (req.method === 'PUT') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const updatedItem = JSON.parse(body);
            list[itemIndex] = { ...list[itemIndex], ...updatedItem };
            writeDataToFile({ list });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(list[itemIndex]));
          });
        } else if (req.method === 'DELETE') {
          const deletedItem = list.splice(itemIndex, 1)[0];
          writeDataToFile({ list });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(deletedItem));
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item not found' }));
      }
    } else {
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(list));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          console.log('JSON.parse(body)', JSON.parse(body), !!JSON.parse(body).buryingPoint)
          if (!!JSON.parse(body).buryingPoint) {
            // 埋点走埋点的库
            const newItem = {
              ...JSON.parse(body),
              ip,
              id: flagB
            };
            listB.push(newItem);
            flagB += 1
            writeDataToFileB({ listB, flagB });
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newItem));
          } else {
            const newItem = {
              ...JSON.parse(body),
              ip,
              id: flag
            };
            list.push(newItem);
            flag += 1
            writeDataToFile({ list, flag });
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newItem));
          }
        });
      }
    }

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
}

exports = module.exports = request;