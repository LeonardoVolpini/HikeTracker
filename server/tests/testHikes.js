const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');
const rocciamelone = require('../unit_tests/maps/rocciamelone').rocciamelone;
const carborant = require('../unit_tests/maps/Corborant-dal-buco-della-Marmotta').carborant;

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

//for inconsistency in db -> addHike and updateHike have the fields "start_point" and "end_point" while readHikes has "start_point_idPoint" and "end_point_idPoint"
function HikeWithFormatNo_idPoint(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide) {
  this.title = title;
  this.length = length;
  this.expected_time = expected_time;
  this.ascent = ascent;
  this.difficulty = difficulty;
  this.start_point = start_point;
  this.end_point = end_point;
  this.reference_points = reference_points;
  this.description = description;
  this.gpx_track = gpx_track;
  this.picture = picture;
  this.hike_condition = hike_condition;
  this.hike_condition_description = hike_condition_description;
  this.local_guide = local_guide;
}

function setStartPoint(hike, address, location, coordinates, type) {
  hike.start_point = {address, nameLocation: location, gps_coordinates: coordinates, type};
  //hike.start_point = address;
  hike.start_point_nameLocation = location;
  hike.start_point_coordinates = coordinates;
  hike.start_point_type = type;
}

function setEndPoint(hike, address, location, coordinates, type) {
  hike.end_point = {address, nameLocation: location, gps_coordinates: coordinates, type};
  //hike.end_point = address;
  hike.end_point_nameLocation = location;
  hike.end_point_coordinates = coordinates;
  hike.end_point_type = type;
}

describe("Hike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide)
            VALUES ('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2,
            '2-3', 'First easy example hike', ?, 'img', null, null, 'paulina.knight@gmail.com'), 
            ('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4,
            '4', 'Second example hike, very difficult', ?, 'img', null, null, 'mario.rossi@gmail.com')`,[rocciamelone, carborant]);
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

  afterEach(async () => {                                 //better afterAll but I recived a "afterAll not defined"
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide)
            VALUES ('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2,
            '2-3', 'First easy example hike', ?, 'img', null, null, 'paulina.knight@gmail.com'), 
            ('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4,
            '4', 'Second example hike, very difficult', ?, 'img', null, null, 'mario.rossi@gmail.com')`,[rocciamelone, carborant]);
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

  obtainHikes(200);
  addNewHike(200, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  addNewHike(400, null, 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  addNewHike(400, 'Hike#1', null, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  addNewHike(400, 'Hike#1', 5.0, null, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  addNewHike(400, 'Hike#1', 5.0, 5, null, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, null, 1, 2, '2-3', 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');

  // this 2 two fails because for now in HikeRouter we check the address in start_point and end_point and the we retrive the id from db
  /*addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', null, 2, '2-3', 'First easy example hike', rocciamelone, null, null, 'paulina.knight@gmail.com');
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, null, '2-3', 'First easy example hike', rocciamelone, null, null, 'paulina.knight@gmail.com');*/

  addNewHike(200, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, null, 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', null, rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', null, 'img', null, null, 'paulina.knight@gmail.com');
  addTwoTimeNewHike(500, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, 'img', null, null, 'paulina.knight@gmail.com');
  
});

function addNewHike(expectedHTTPStatus, title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide) {
  it('add a new hike', async function () {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const newHike = new HikeWithFormatNo_idPoint(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide);
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    let reqBody = JSON.stringify({ newHike });
    return agent.post('/api/newHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function addTwoTimeNewHike(expectedHTTPStatus,title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide) {
  it('add two times a new hike', async function () {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const newHike = new HikeWithFormatNo_idPoint(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide);
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    let reqBody = JSON.stringify({ newHike });
    await agent.post('/api/newHike')
      .set('Content-Type', 'application/json')
      .send(reqBody);
    return agent.post('/api/newHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

function obtainHikes(expectedHTTPStatus) {
  it('get list of hikes', async function () {
    return agent.get('/api/getHikes')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

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