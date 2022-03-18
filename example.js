const NotExpress = require('./src/main');

const app = NotExpress()
//NotExpress.prototype.static('public')

app.use("/hello", (req,res) => {
  console.log('This is app.use()')
})

// next param is apparently useless right now
function testMid(req,res,next){
  console.log(req.body)
}

app.get('/hello', testMid ,(req,res) => {
  console.log('HI')
  res.end("Hi")
})
app.post('/hi', (req,res) => {
  console.log(req.body.name);
  console.log(req.params.message)
  res.status(201).json({ message: "Hello" })
})

app.delete('/delete', (req,res) => {
  res.status(200).json({
    message: 'Delete success'
  })
})

app.put('/put', (req,res) => {
  res.status(200).json({
    message: 'Put success'
  })
})

app.get('/file', (req,res) => {
  res.sendFile('./index.html')
})
app.listen(4000, () => {
  console.log(`Server running on port 4000`)
})

