const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

function HutPoint(address, nameLocation, gps_coordinates, type, capacity, altitude, phone, email, web_site, description, picture) {
  this.address = address;
  this.nameLocation = nameLocation;
  this.gps_coordinates = gps_coordinates;
  this.type = type;
  this.capacity = capacity;
  this.altitude = altitude;
  this.phone = phone;
  this.email = email;
  this.web_site = web_site;
  this.description = description;
  this.picture = picture;
}

describe("Huts test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run("INSERT OR IGNORE INTO Points(address, nameLocation, gps_coordinates, type, capacity, altitude)\
                        VALUES ('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',\
                        'Hut#1', '45.177786,7.083372', 'Hut', null, null), \
                        ('Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',\
                        'Hut#2', '45.203531,7.07734', 'Hut', null, null), \
                        ('327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',\
                        'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot', null, null), \
                        ('Vinadio, Cuneo, Piedmont, Italy',\
                        'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot', null, null)");
    await testDao.run(`INSERT OR IGNORE INTO Huts(idHut, nameHut, phone, email, web_site, description, picture)
                        VALUES (1, "Strada Provinciale 53 di Val d'Orcia",
                        '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', 'img'),
                        (2, "Hut#1",
                        '3209987875', 'test@gmail.com', 'www.test.com', 'Testing hut', 'img')`);
  });

  afterEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run("INSERT OR IGNORE INTO Points(address, nameLocation, gps_coordinates, type, capacity, altitude)\
                        VALUES ('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',\
                        'Hut#1', '45.177786,7.083372', 'Hut', null, null), \
                        ('Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',\
                        'Hut#2', '45.203531,7.07734', 'Hut', null, null), \
                        ('327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',\
                        'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot', null, null), \
                        ('Vinadio, Cuneo, Piedmont, Italy',\
                        'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot', null, null)");
    await testDao.run(`INSERT OR IGNORE INTO Huts(idHut, nameHut, phone, email, web_site, description, picture)
                        VALUES (1, "Strada Provinciale 53 di Val d'Orcia",
                        '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', 'img'),
                        (2, "Hut#1",
                        '3209987875', 'test@gmail.com', 'www.test.com', 'Testing hut', 'img')`);
    await testDao.run("INSERT OR IGNORE INTO HikePoint(idPoint, titleHike)\
                        VALUES ('4', 'Hike#1'), \
                        ('3', 'Hike#2'), \
                        ('1', 'Hike#2'), \
                        ('1', 'Hike#1')");
  });

  obtainHuts(200);
  addNewHut(200, 'address test', 'Hut#Test', 'test coordionates', 'Hut', 1, 2000, 'test phone', 'testing@gmail.com', 'www.test.com', 'Testing hut new', 'img');
  addNewHut(400, 'address test', 'Hut#Test', 'test coordionates', 'Hut', 1, 2000, null, 'testing@gmail.com', 'www.test.com', 'Testing hut new', 'img');
  addNewHut(400, 'address test', 'Hut#Test', 'test coordionates', 'Hut', 1, 2000, 'test phone', null, 'www.test.com', 'Testing hut new', 'img');
  addNewHut(400, 'address test', 'Hut#Test', 'test coordionates', 'Hut', 1, 2000, 'test phone', 'testing@gmail.com', 'www.test.com', null, 'img');
  addNewHut(400, 'address test', 'Hut#Test', 'test coordionates', 'Hut', 1, 2000, 'test phone', 'testing@gmail.com', 'www.test.com', 'Testing hut new', null);
  addTwoTimeNewHut(500, 'address test', 'Hut#Test', 'test coordionates', 'Hut', 1, 2000, 'test phone', 'testing@gmail.com', 'www.test.com', 'Testing hut new', 'img');

});

function addNewHut(expectedHTTPStatus, address, nameLocation, gps_coordinates, type, capacity, altitude, phone, email, web_site, description, picture) {
  it('add a new hut', async function () {
    await testDao.run('DELETE FROM Huts');
    const hut = new HutPoint(address, nameLocation, gps_coordinates, type, capacity, altitude, phone, email, web_site, description, picture);
    let reqBody = JSON.stringify({ hut });
    return agent.post('/api/Huts')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function addTwoTimeNewHut(expectedHTTPStatus, address, nameLocation, gps_coordinates, type, capacity, altitude, phone, email, web_site, description, picture) {
  it('add two times a new hut', async function () {
    await testDao.run('DELETE FROM Huts');
    const hut = new HutPoint(address, nameLocation, gps_coordinates, type, capacity, altitude, phone, email, web_site, description, picture);
    let reqBody = JSON.stringify({ hut });
    await agent.post('/api/Huts')
      .set('Content-Type', 'application/json')
      .send(reqBody);
    return agent.post('/api/Huts')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

function obtainHuts(expectedHTTPStatus) {
  it('get list of huts', async function () {
    return agent.get('/api/getHuts')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};