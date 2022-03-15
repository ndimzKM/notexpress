const path = require('path')
const fs = require('fs')

function response(res, publicFolder) {
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
  res.sendFile = function(filepath){
    if(path.extname(filepath) != '.html' || path.extname(filepath) != '.html'){
      res.status(403).json({
        message: "File type not supported"
      })      
    } else{
      let pathToJoin = publicFolder 
                        ? publicFolder 
                        : path.join(__dirname, "../")
      const resolvedPath = path.join(pathToJoin, filepath)
      try{
        const stats = fs.statSync(resolvedPath);

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', stats.size);
        res.statusCode = 200;

        const readStream = fs.createReadStream(resolvedPath)
        readStream.pipe(res);
      }catch(error){
        res.status(500).json({
          message: "Server error"
        })
      }
    }
  }
}

module.exports = response
