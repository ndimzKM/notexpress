const http = require('http')
const request = require('./request')
const response = require('./response')

function NotExpress(){
  let middleware = [];

  function use(path = "*", cb){
    if(!cb){
      cb = path
      path = "*"
    }
    middleware.push({
      method: null,
      path,
      cb
    })
  }

  function get(path, cb){
    middleware.push({
      method: 'GET',
      path,
      cb
    })
  }

  function post(path, cb){
    middleware.push({
      method: 'POST',
      path,
      cb
    })
  }

  function getMiddleware(path, method){
    if(path.includes('?')){
      path = path.split('?')[0]
    }
    let middle = middleware.find(m => m.path === path && m.method === method);
    if(middle) return middle;
    return false;
  }

  function getUseMethods(){
    return middleware.filter(m => m.method === null);
  }

  function requestHandler(req, res){
    //console.log(req.method, req.url)
    //middleware[0].cb(req,res);
    //console.log(middleware)
    const current = getMiddleware(req.url, req.method);
    const useMethods = getUseMethods()
    if(current === false){
      res.status(404).json({
        message:"Route not found"
      })
    } else{
        for(let use of useMethods){
          if(use.path === "*"){
            use.cb(req,res)
          }else if(use.path === current.path){
            use.cb(req,res)
          }else{
            continue
          }
        }
        req.body.then(data => {
        req.body = data;
        return current.cb(req,res);
      })
    }
    /*
    req.body.then(data => {
      return current.cb(req,res)
    })*/
    //return current.cb(req,res)
  }

  function listen(port, cb){
    return http.createServer((req,res) => {
      request(req)
      response(res)
      requestHandler(req,res)
    }).listen(port, () => {
      if(cb instanceof Function) return cb()
      else{
        console.log('Server started')
      }
    })
  }

  return {
    listen,
    get,
    post,
    use
  }
}

module.exports = NotExpress
