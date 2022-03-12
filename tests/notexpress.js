const assert = require('assert');
const supertest = require('supertest')
const NotExpress = require('../src/main');

const app = NotExpress()
app.listen(4000)

describe('App', () => {
  it('should be able to create instance', done => {
    const App = NotExpress();
    assert.equal(typeof App, 'object')
    done()
  });

  it('has the minimum required properties', done => {
    const App = NotExpress();
    assert.equal(App.hasOwnProperty('listen'), true)
    done()
  })

  /*
  it('get request working', done => {
    supertest(app)
      .get('/hello')
      .expect(200)
      .end((err,res) => {
        if(err) return done(err)
        done()
      })
  })
  */
})
