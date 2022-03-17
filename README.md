![Logo](https://github.com/ndimzKM/notexpress/blob/main/src/logo.png?raw=true)


[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
![GitHub code size](https://img.shields.io/github/languages/code-size/ndimzKM/notexpress)
![Version](https://img.shields.io/npm/v/@ndimz/notexpress)
# notexpress

A small NodeJS framework that is not a replacement of ExpressJS. Just like Express.js, it is unopinionated and minimal and contains over 80% of the features in Express.js

```
const notexpress = require('@ndimz/notexpress')
const app = notexpress()

app.get('/', function (req, res) {
  res.send('Goodday World')
})

app.listen(5000)
```
## Installation

The only requirement to use notexpress is that you have Node.js installed.
```bash
  npm install @ndimz/notexpress
```

## Features

- ⚙ Express middleware compatible
- 🚀 No legacy dependencies, just the JavaScript itself
- 📦 Lesser bundle size than Express

## License

[MIT](https://choosealicense.com/licenses/mit/)


