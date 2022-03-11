
function response(res) {
  res.json = function(data){
    if(typeof data !== "object") throw new Error("You must pass an object to res.json")
    res.setHeader('Content-Type', 'application/json');
    data = JSON.stringify(data)
    res.send(data);
  }
  res.send = function(data){
    res.end(data)
  }
  res.status = function(code){
    res.statusCode = Number(code)
    return res;
  }
}

module.exports = response
