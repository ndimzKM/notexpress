function parseMiddleware(args){
  let middleware = {callbacks:[]}
  for(let arg of args){
    if(typeof(arg) == 'string'){
      middleware.path = arg
    }else{
      middleware.callbacks.push(arg);
    }
  }

  return middleware
}

module.exports = { parseMiddleware }
