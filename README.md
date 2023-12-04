[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
![GitHub code size](https://img.shields.io/github/languages/code-size/ndimzKM/notexpress)
![Version](https://img.shields.io/npm/v/@ndimz/notexpress)

# notexpress

A small NodeJS framework that is not a replacement of ExpressJS. Just like Express.js, it is unopinionated and minimal and contains up to 95% of the features in Express.js. I only hope the percentage will increase.

```
const notexpress = require('@ndimz/notexpress')
const app = new notexpress()

app.get('/', function (req, res) {
  res.send('Goodday World')
})

app.listen(5000)
```

## Features

- ⚙ Express middleware compatible
- 🚀 No legacy dependencies, just the JavaScript itself
- 🍪 Built-in cookie parser
- 📦 Lesser bundle size than Express

Visit [notexpress](https://ndimz.gitbook.io/notexpress/) website for documentation.

## Installation

The only requirement to use notexpress is that you have Node.js installed.

```bash
  npm install @ndimz/notexpress
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
