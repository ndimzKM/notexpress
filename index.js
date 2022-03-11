const NotExpress = require('./src/main');

const app = NotExpress()

app.use("/hello", (req,res) => {
  console.log('This is app.use()')
})

app.get('/hello', (req,res) => {
  console.log('HI')
  res.end("Hi")
})

app.post('/hi', (req,res) => {
  console.log('Post HI');
  res.end("HI POST REQUEST")
})

app.listen(4000, () => {
  console.log(`Server running on port 4000`)
})
