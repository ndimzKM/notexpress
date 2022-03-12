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
  res.status(201).json({ message: "Hello" })
  //res.json({message: "Hello"})
})

app.listen(4000, () => {
  console.log(`Server running on port 4000`)
})

module.exports = app;
