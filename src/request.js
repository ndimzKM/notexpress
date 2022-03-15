
function request(req){
  req.body = parseReqBody(req)
  req.params = parseParams(req)
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
  if(!req.url.includes('?')) return ({});

  let parsed = {};
  let urls = req.url.split('/')[1]
  urls = urls.split('?')[1]
  urls = urls.split('&')

  for(let url of urls){
    parsed[`${url.split('=')[0]}`] = url.split('=')[1];
  }

  return parsed;

}

module.exports = request
