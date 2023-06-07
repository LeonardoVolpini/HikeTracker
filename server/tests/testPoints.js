const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

function Point(address, nameLocation, gps_coordinates, type) {
  this.address = address;
  this.nameLocation = nameLocation;
  this.gps_coordinates = gps_coordinates;
  this.type = type;
}

describe("Points test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Points(address, nameLocation, gps_coordinates, type)
                            VALUES ('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                            'Hut#1', '45.177786,7.083372', 'Hut'), 
                            ('Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',
                            'Hut#2', '45.203531,7.07734', 'Hut'), 
                            ('327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',
                            'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot'), 
                            ('Vinadio, Cuneo, Piedmont, Italy',
                            'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot')`);
  });

  afterEach(async () => {                                 //better afterAll but I recived a "afterAll nt defined"
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Points(address, nameLocation, gps_coordinates, type)
                            VALUES ('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                            'Hut#1', '45.177786,7.083372', 'Hut'), 
                            ('Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',
                            'Hut#2', '45.203531,7.07734', 'Hut'), 
                            ('327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',
                            'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot'), 
                            ('Vinadio, Cuneo, Piedmont, Italy',
                            'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot')`);
    await testDao.run(`INSERT OR IGNORE INTO HikePoint(idPoint, titleHike)
                                            VALUES ('4', 'Hike#1'), 
                                            ('3', 'Hike#2'), 
                                            ('1', 'Hike#2'), 
                                            ('1', 'Hike#1')`);
  });

  addNewPoint(200, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy', 'Hut#1', '45.177786,7.083372', 'Hut');
  addNewPoint(400, null, 'Hut#1', '45.177786,7.083372', 'Hut');
  addNewPoint(400, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy', 'Hut#1', null, 'Hut');
  addTwoTimeNewPoint(200, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy', 'Hut#1', '45.177786,7.083372', 'Hut');

});

function addNewPoint(expectedHTTPStatus, address, nameLocation, gps_coordinates, type) {
  it('add a new point', async function () {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const point = new Point(address, nameLocation, gps_coordinates, type);
    let reqBody = JSON.stringify({ point });
    return agent.post('/api/Point')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function addTwoTimeNewPoint(expectedHTTPStatus, address, nameLocation, gps_coordinates, type) {
  it('add two times a new point', async function () {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const point = new Point(address, nameLocation, gps_coordinates, type);
    let reqBody = JSON.stringify({ point });
    await agent.post('/api/Point')
      .set('Content-Type', 'application/json')
      .send(reqBody);
    return agent.post('/api/Point')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

/*async function logout() {
  await agent.delete('/api/sessions/current')
}

async function login() {
  await agent.post('/api/sessions')
    .send(userCredentials)
    .then(function (res) {
      res.should.have.status(200);
    });
}*/