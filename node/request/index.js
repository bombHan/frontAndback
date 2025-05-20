const url = require('url');

const calculateRequest = require('./calculate/index')
const userRequest = require('./user/index')

const request = (req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  console.log('path', path)

  const parsedUrlArray = path.split('/')

  const requestList = [
    { mode: 'calculate', request: calculateRequest },
    { mode: 'user', request: userRequest }
  ]
  const targetRequest = requestList.find((item) => { return item.mode === parsedUrlArray[1] })

  // console.log('path', path, 'parsedUrlArray', parsedUrlArray, 'targetRequest', targetRequest)
  if (targetRequest) {
    targetRequest.request(req, res)
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
}

exports = module.exports = request;