const url = require('url')

function request(req){
  req.body = parseReqBody(req)
  req.params = parseParams(req)
  req.baseUrl = req.url.split('?')[0]
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

function parseParams(req){

  const curl = new URL(req.headers.host + req.url);
  const params = curl.searchParams;
  let parsed = {};

  for(key of params.keys()){
    parsed[key] = params.get(key);
  }

  return parsed;

}

module.exports = request
