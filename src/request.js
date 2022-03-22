const url = require('url')

function request(req, middlewares){
  req.body = parseReqBody(req)
  req.baseUrl = '/' + req.url.split('/')[1];
  req.query = parseQueryParams(req)
  req.params = parseParams(req, middlewares)
  req.originalUrl = req.url
}

async function parseReqBody(req){
  let buffers = [];

  for await (const chunk of req){
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString()
  let returnVal = undefined
  try{
    returnVal = JSON.parse(data)
  }catch(err){
    returnVal = undefined
  }
  return returnVal;
}

function parseParams(req, middlewares){
  let middleware = middlewares.find(mid => mid.path.split("/:")[0] == req.baseUrl)
  let params = []
  let p = {}
  if(middleware && middleware.path.includes(":")){
    params = middleware.path.split("/")
    for(let i = 0; i < params.length; i++){
      if(params[i].includes(":")){
        console.log(params[i])
        p[params[i].substring(1)] = getParamValue(i, req.url)
        params[i] = params[i].substring(1)
      }
    }
  }
  return p;

}

function getParamValue(keyIndex, reqUrl){
  let values = reqUrl.split('/')
  return values[keyIndex];
}

function parseQueryParams(req){

  const curl = new URL(req.headers.host + req.url);
  const params = curl.searchParams;
  let parsed = {};

  for(key of params.keys()){
    parsed[key] = params.get(key);
  }

  return parsed;

}

module.exports = request
