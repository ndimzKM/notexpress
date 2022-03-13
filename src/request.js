
function request(req){
  req.body = parseReqBody(req)
}

async function parseReqBody(req){
  let buffers = [];

  for await (const chunk of req){
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString()
  return JSON.parse(data);
}

module.exports = request
