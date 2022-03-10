const http = require('http')

function NotExpress(){
  let server;
  let middleware = [];

  function get(path, cb){
    middleware.push({
      path,
      cb
    })
  }

  function requestHandler(req, res){
    middleware[0].cb(req,res);
    console.log(middleware)
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
    get
  }
}

module.exports = NotExpress
