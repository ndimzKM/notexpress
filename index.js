const NotExpress = require('./src/main');

const app = NotExpress()

app.get('/hello', (req,res) => {
  console.log('HI')
  res.end("Hi")
})

app.listen(4000, () => {
  console.log(`Server running on port 4000`)
})
