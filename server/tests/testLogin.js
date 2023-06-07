const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
const { getUser } = require('../user-dao');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

describe('test login', () => {

  loginUser(200, 'mario.rossi@gmail.com', 'hello12');     //correct email and password
  loginUser(401, 'mario.rossi@gmail.com', 'password');    //wrong password
  loginUser(401, 'xxxxxxxxx@gmail.com', 'hello12');    //wrong email
  logout(200, 'mario.rossi@gmail.com', 'hello12');
  obtainUserNotAuthenticated(401, 'mario.rossi@gmail.com', 'password');
  obtainUserAuthenticated(200, 'mario.rossi@gmail.com', 'hello12');

});

function loginUser(expectedHTTPStatus, username, password) {
  it('login', async function () {
    const credentials = { username, password };
    let reqBody = JSON.stringify(credentials);
    return agent.post('/api/sessions')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

function logout(expectedHTTPStatus, username, password) {
  it('logout', async function () {
    const credentials = { username, password };
    let reqBody = JSON.stringify(credentials);
    await agent.post('/api/sessions')
      .set('Content-Type', 'application/json')
      .send(reqBody);
    return agent.delete('/api/sessions/current')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

function obtainUserAuthenticated(expectedHTTPStatus, username, password) {
  it('get user', async function () {
    const credentials = { username, password };
    let reqBody = JSON.stringify(credentials);
    await agent.post('/api/sessions')
      .set('Content-Type', 'application/json')
      .send(reqBody)
    return agent.get('/api/sessions/current')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
        res.body.username.should.equal(username);
      });
  });
}

function obtainUserNotAuthenticated(expectedHTTPStatus, username, password) {
  it('get user', async function () {
    const credentials = { username, password };
    let reqBody = JSON.stringify(credentials);
    return agent.post('/api/sessions')
      .set('Content-Type', 'application/json')
      .send(reqBody)
    .then(() => {
    return agent.get('/api/sessions/current')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
        res.body.error.should.equal('Not authenticated');
      });
    });
  });
}