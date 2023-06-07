const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

const rocciamelone = require('../unit_tests/maps/rocciamelone').rocciamelone;
const carborant = require('../unit_tests/maps/Corborant-dal-buco-della-Marmotta').carborant;

describe("HikerHike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run('DELETE FROM HikerHikeStatistics');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
    await testDao.run("INSERT OR IGNORE INTO HikerHikeStatistics(hiker, hike, times_completed, best_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', 2, 60),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', 6, 30)");
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide)
                    VALUES ('Form Pian Belota to la Vacca', 5.0, 5, 5.0, 'Tourist', 1, 2,
                    '2-3', 'First easy example hike', ?, 'img', null, null, 'paulina.knight@gmail.com'), 
                    ('Hike Monte Thabor', 10.0, 10, 10.0, 'Professional hiker', 3, 4,
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
                                                    VALUES ('2', 'Form Pian Belota to la Vacca'), 
                                                    ('4', 'Hike Monte Thabor'),  
                                                    ('3', 'Form Pian Belota to la Vacca')`);
  });

  afterEach(async () => {                                 //better afterAll but I recived a "afterAll nt defined"
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run('DELETE FROM HikerHikeStatistics');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
    await testDao.run("INSERT OR IGNORE INTO HikerHikeStatistics(hiker, hike, times_completed, best_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', 2, 60),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', 6, 30)");
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide)
                    VALUES ('Form Pian Belota to la Vacca', 5.0, 5, 5.0, 'Tourist', 1, 2,
                    '2-3', 'First easy example hike', ?, 'img', null, null, 'paulina.knight@gmail.com'), 
                    ('Hike Monte Thabor', 10.0, 10, 10.0, 'Professional hiker', 3, 4,
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
                                                    VALUES ('2', 'Form Pian Belota to la Vacca'), 
                                                    ('4', 'Hike Monte Thabor'),  
                                                    ('3', 'Form Pian Belota to la Vacca')`);
  });

  startingHike(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00');
  startingHike(400, null, 'Form Pian Belota to la Vacca', '15.00');
  startingHike(400, 'mario.rossi@gmail.com', null, '15.00');
  startingHike(400, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', null);
  startingTwoTimeAnHike(422, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00')

  updatingEndTime(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00', '18.00');
  updatingEndTime(400, null, 'Form Pian Belota to la Vacca', '15.00', '18.00');
  updatingEndTime(400, 'mario.rossi@gmail.com', null, '15.00', '18.00');
  updatingEndTime(400, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', null, '18.00');

  terminateHikeFirstTime(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 60);
  terminateHikeFirstTime(400, null, 'Form Pian Belota to la Vacca', 60);
  terminateHikeFirstTime(400, 'mario.rossi@gmail.com', null, 60);

  terminateHike(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 60);
  terminateHike(400, null, 'Form Pian Belota to la Vacca', 60);
  terminateHike(400, 'mario.rossi@gmail.com', null, 60);

  flagFirstTime(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca');

  obtainOnGoingHike(200, 'mario.rossi@gmail.com');
  obtainFinishedHikes(200);
  obtainDistinctFinishedHikes(200);
  obtainFinishedHikesByHiker(200, 'mario.rossi@gmail.com');
  
});

function startingHike(expectedHTTPStatus, hiker_email, hike_title, start_time) {
  it('start a hike', async function () {
    await testDao.run('DELETE FROM HikerHike');
    let reqBody = JSON.stringify({ hiker_email, hike_title, start_time });
    return agent.post('/api/startHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function startingTwoTimeAnHike(expectedHTTPStatus, hiker_email, hike_title, start_time) {
  it('start two time a hike', async function () {
    await testDao.run('DELETE FROM HikerHike');
    let reqBody = JSON.stringify({ hiker_email, hike_title, start_time });
    await agent.post('/api/startHike')
      .set('Content-Type', 'application/json')
      .send(reqBody);
    return agent.post('/api/startHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function updatingEndTime(expectedHTTPStatus, hiker_email, hike_title, start_time, end_time) {
  it('update the ending time of a hike', async function () {
    let reqBody = JSON.stringify({ hiker_email, hike_title, start_time, end_time });
    return agent.put('/api/updateEndTime')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function terminateHikeFirstTime(expectedHTTPStatus, hiker_email, hike_title, duration) {
  it('terminate an hike for the first time', async function () {
    await testDao.run('DELETE FROM HikerHikeStatistics');
    let reqBody = JSON.stringify({ hiker_email, hike_title, duration });
    return agent.post('/api/endHikeFirstTime')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function terminateHike(expectedHTTPStatus, hiker_email, hike_title, duration) {
  it('terminate an hike for the first time', async function () {
    let reqBody = JSON.stringify({ hiker_email, hike_title, duration });
    return agent.put('/api/endHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function flagFirstTime(expectedHTTPStatus, hiker_email, hike_title) {
  it('check if it is the first time to terminate this hike', async function () {
    return agent.get(`/api/checkFirstTime?hiker=${hiker_email}&hike=${hike_title}`)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

function obtainOnGoingHike(expectedHTTPStatus, hiker_email) {
  it('get list of finished hikes', async function () {
    return agent.get('/api/getOnGoingHike/'+hiker_email)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

function obtainFinishedHikes(expectedHTTPStatus) {
  it('get list of finished hikes', async function () {
    return agent.get('/api/getFinishedHikes')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

function obtainDistinctFinishedHikes(expectedHTTPStatus) {
  it('get list of finished hikes, without duplicates', async function () {
    return agent.get('/api/getDistinctFinishedHikes')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

function obtainFinishedHikesByHiker(expectedHTTPStatus, hiker_email) {
  it('get list of finished hikes by a specific hiker', async function () {
    return agent.get('/api/getFinishedHikesByHiker/'+hiker_email)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};