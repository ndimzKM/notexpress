const NotExpress = require('./src/main');

const app = NotExpress()
//NotExpress.prototype.static('public')
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use("/hello", (req,res) => {
  console.log('This is app.use()')
})

// next param is apparently useless right now
function testMid(req,res,next){
  console.log(req.body)
}

app.get('/ejs', (req,res) => {
  res.render('test')
})


app.get("/posts/:id/:post", (req,res) => {
  console.log(req.query)
  res.end("Testing req.params")
})

app.get('/hello', testMid ,(req,res) => {
  console.log(req.params)
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

