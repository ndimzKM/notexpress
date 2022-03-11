const http = require('http')
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
      throw new Error('Route or method not found');
    }

    for(let use of useMethods){
      if(use.path === "*"){
        use.cb(req,res)
      }else if(use.path === current.path){
        use.cb(req,res)
      }else{
        continue
      }
    }
    return current.cb(req,res)
  }

  function listen(port, cb){
    return http.createServer((req,res) => {
      response(res)
      requestHandler(req,res)
    }).listen(port, () => {
      if(cb instanceof Function) return cb()
      throw new Error("You need to pass a callback")
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
