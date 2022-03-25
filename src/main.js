const path = require('path')
const http = require('http')
const request = require('./request')
const response = require('./response')
const { parseMiddleware } = require('../lib/utils')

class NotExpress {
  #middlewares;
  #globals;
  static routes = [];

  constructor(){
    this.#middlewares = [];
    this.#globals = {
      views:"",
      "view engine": ""
    };
  }

  static Router(){
    return {
      get: function(...args){
        let route = parseMiddleware(args);
        route.method = 'GET'
        NotExpress.routes.push(route)
      },
      post: function(...args){
        let route = parseMiddleware(args);
        route.method = 'POST'
        NotExpress.routes.push(route)
      },

      put: function(...args){
        let route = parseMiddleware(args);
        route.method = 'PUT'
        NotExpress.routes.push(route)
      },

      del: function(...args){
        let route = parseMiddleware(args);
        route.method = 'DELETE'
        NotExpress.routes.push(route)
      },

    }
  }

  #getMiddleware(path, method){
    if(path.includes('?')){
      path = path.split('?')[0]
    }
    /*
    if(path.match(/\//g).length > 1){
      path = "/" + path.split('/')[1];
    }
    */

    //console.log(this.#middlewares)
    console.log(path)
    let middle = this.#middlewares.find(m => m.path.split("/:")[0] === path && m.method === method);
    if(middle) return middle;
    else if(middle == undefined){
      if(path.match(/\//g).length > 1){
        path = "/" + path.split('/')[1];
      }
      let middle = this.#middlewares.find(m => m.path.split("/:")[0] === path && m.method === method);
      return middle;
    }
    return false;
  }

  #getUseMethods(){
    return this.#middlewares.filter(m => m.method === null);
  }

  #requestHandler(req,res){
    const current = this.#getMiddleware(req.url, req.method);
    const useMethods = this.#getUseMethods()
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
  }

  #routerMiddleware(args){
    let baseUrl = args[0];
    NotExpress.routes.forEach(route => {
      let middleware = {
        path: baseUrl + route.path,
        callbacks: route.callbacks,
        method: route.method
      }
      this.#middlewares.push(middleware)
    })
  }

  listen(...args){
    let hostname = "127.0.0.1", port = 5000, cb;
    if(args.length > 3) throw new Error("argument count to app.listen() exceeds limit of 3");
    for(let arg of args){
      if(typeof(arg) == 'string') hostname = arg;
      else if(typeof(arg) == 'number') port = arg;
      else if(arg instanceof Function) cb = arg;
      else throw new Error('argument type passed to app.listen() not supported');      
    }
    let publicFolder = NotExpress.prototype.public
    return http.createServer((req,res) => {
      request(req, this.#middlewares)
      response(res, publicFolder, this.#globals)
      this.#requestHandler(req,res)
    }).listen(port, hostname, () => {
      if(cb instanceof Function) return cb()
      else{
        console.log('Server started')
      }
    })
  }

  use(...args){
    if(args.length == 2 && typeof(args[1]) == 'object'){
      this.#routerMiddleware(args)
    }else {
      let middleware = parseMiddleware(args)
      //middleware.callbacks = middleware.callbacks[0];
      if(middleware.path == undefined) middleware.path = "*"
      this.#middlewares.push({
        ...middleware,
        method: null
      })
    }
  }

  get(...args){
    let middleware = parseMiddleware(args)
    
    this.#middlewares.push({
      ...middleware,
      method: 'GET'
    })

  }
  post(...args){
    let middleware = parseMiddleware(args)

    this.#middlewares.push({
      ...middleware,
      method: 'POST'
    })
  }

  put(...args){
    let middleware = parseMiddleware(args)

    this.#middlewares.push({
      ...middleware,
      method: 'PUT'
    })
  }

  del(...args){
    let middleware = parseMiddleware(args)
    this.#middlewares.push({
      ...middleware,
      method: 'DELETE'
    })
  }

  set(key, value){
    this.#globals = { ...this.#globals, [key]: value };
  }

  enable(key){
    this.#globals[key] = true;
  }

  enabled(key){
    return this.#globals[key] !== undefined;
  }

  disable(key){
    this.#globals[key] = false;
  }

  disabled(key){
    return this.#globals[key] === undefined;
  }

}

module.exports = NotExpress;
