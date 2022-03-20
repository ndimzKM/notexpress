const path = require('path')
const http = require('http')
const request = require('./request')
const response = require('./response')
const { parseMiddleware } = require('../lib/utils')

function NotExpress(){
  let middlewares = [];
  let globals = {
    views: "",
    "view engine": ""
  };

  function set(key, value){
    globals = { ...globals, [key]: value };
  }

  function use(...args){
    let middleware = parseMiddleware(args)
    //middleware.callbacks = middleware.callbacks[0];
    if(middleware.path == undefined) middleware.path = "*"
    middlewares.push({
      ...middleware,
      method: null
    })
  }

  function get(...args){
    let middleware = parseMiddleware(args)
    
    middlewares.push({
      ...middleware,
      method: 'GET'
    })
    
  }
  function post(...args){
    let middleware = parseMiddleware(args)

    middlewares.push({
      ...middleware,
      method: 'POST'
    })
  }

  function put(...args){
    let middleware = parseMiddleware(args)

    middlewares.push({
      ...middleware,
      method: 'PUT'
    })
  }

  function deleteMethod(...args){
    let middleware = parseMiddleware(args)
    middlewares.push({
      ...middleware,
      method: 'DELETE'
    })
  }

  function getMiddleware(path, method){
    if(path.includes('?')){
      path = path.split('?')[0]
    }
    let middle = middlewares.find(m => m.path === path && m.method === method);
    if(middle) return middle;
    return false;
  }

  function getUseMethods(){
    return middlewares.filter(m => m.method === null);
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
          if(use.path === "*" || use.path.includes(req.url)){
            use.callbacks.forEach(cb => {
              cb(req,res)
            })
          }else{
            continue
          }
        }
        let currentMidCounter = 0;
        
        const next = () => {
          currentMidCounter += 1;
        }

        if(current.callbacks.length > 1){
          for(let i = 0; i < current.callbacks.length - 1; i++){
            if(currentMidCounter < current.callbacks.length){
              req.body.then(data => {
                req.body = data;
                current.callbacks[currentMidCounter](req,res,next)
              })
            }
          }
        }

        
        req.body.then(data => {
          req.body = data;
          let finalCallback = current.callbacks.slice(-1)[0]
          finalCallback(req,res);
          //return current.callbacks[-1](req,res);
        })
        
    }
    
    /*
    req.body.then(data => {
      return current.cb(req,res)
    })*/
    //return current.cb(req,res)
  }

  function listen(port, cb){
    let publicFolder = NotExpress.prototype.public
    return http.createServer((req,res) => {
      request(req)
      response(res, publicFolder, globals)
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
    put,
    delete: deleteMethod,
    use,
    set
  }
}

NotExpress.prototype.static = function(dirname){
  NotExpress.prototype.public = path.join(__dirname, '../',dirname);
}

module.exports = NotExpress
