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

  function set(key, value){
    globals = { ...globals, [key]: value };
  }

  function enable(key){
    globals[key] = true;
  }

  function enabled(key){
    return globals[key] !== undefined;
  }

  function disable(key){
    globals[key] = false;
  }

  function disabled(key){
    return globals[key] === undefined;
  }


  function getMiddleware(path, method){
    if(path.includes('?')){
      path = path.split('?')[0]
    }
    if(path.match(/\//g).length > 1){
      path = "/" + path.split('/')[1];
    }
    let middle = middlewares.find(m => m.path.split("/:")[0] === path && m.method === method);
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

  function listen(...args){
    let hostname, port, cb;
    if(args.length > 3) throw new Error("argument count to app.listen() exceeds limit of 3");
    for(let arg of args){
      if(typeof(arg) == 'string') hostname = arg;
      else if(typeof(arg) == 'number') port = arg;
      else if(arg instanceof Function) cb = arg;
      else throw new Error('argument type passed to app.listen() not supported');      
    }
    let publicFolder = NotExpress.prototype.public
    return http.createServer((req,res) => {
      request(req, middlewares)
      response(res, publicFolder, globals)
      requestHandler(req,res)
    }).listen(port, hostname, () => {
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
    set,
    enable,
    enabled,
    disable,
    disabled
  }
}

NotExpress.prototype.static = function(dirname){
  NotExpress.prototype.public = path.join(__dirname, '../',dirname);
}

module.exports = NotExpress
