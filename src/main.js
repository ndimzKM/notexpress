const http = require('http')

function NotExpress(){
  let middleware = [];

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

  function requestHandler(req, res){
    //console.log(req.method, req.url)
    //middleware[0].cb(req,res);
    //console.log(middleware)
    const current = getMiddleware(req.url, req.method);
    if(current === false){
      throw new Error('Route or method not found');
    }

    return current.cb(req,res)
  }

  function listen(port, cb){
    return http.createServer((req,res) => {
      requestHandler(req,res)
    }).listen(port, () => {
      if(cb instanceof Function) return cb()
      throw new Error("You need to pass a callback")
    })
  }

  return {
    listen,
    get,
    post
  }
}

module.exports = NotExpress
