'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');
const rocciamelone = require('./maps/rocciamelone').rocciamelone;
const carborant = require('./maps/Corborant-dal-buco-della-Marmotta').carborant;

describe("Hike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide)
            VALUES ('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2,
            '2-3', 'First easy example hike', ?, null, null, null, 'paulina.knight@gmail.com'), 
            ('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4,
            '4', 'Second example hike, very difficult', ?, null, null, null, 'mario.rossi@gmail.com')`, [rocciamelone, carborant]);
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
                                            VALUES (4, 'Hike#2'), 
                                            (2, 'Hike#1'), 
                                            (3, 'Hike#1')`);
  });

  afterAll(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide)
            VALUES ('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2,
            '2-3', 'First easy example hike', ?, null, null, null, 'paulina.knight@gmail.com'), 
            ('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4,
            '4', 'Second example hike, very difficult', ?, null, null, null, 'mario.rossi@gmail.com')`, [rocciamelone, carborant]);
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
                            VALUES (4, 'Hike#2'), 
                            (2, 'Hike#1'), 
                            (3, 'Hike#1')`);
  });

  function Hike(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide) {
    this.title = title;
    this.length = length;
    this.expected_time = expected_time;
    this.ascent = ascent;
    this.difficulty = difficulty;
    this.start_point_idPoint = start_point;
    this.end_point_idPoint = end_point;
    this.reference_points = reference_points;
    this.description = description;
    this.gpx_track = gpx_track;
    this.picture = picture;
    this.hike_condition = hike_condition;
    this.hike_condition_description = hike_condition_description;
    this.local_guide = local_guide;
  }

  function HikeNoRefPoints(title, length, expected_time, ascent, difficulty, start_point, end_point, description, gpx_track, picture, hike_condition, hike_condition_description, local_guide) {
    this.title = title;
    this.length = length;
    this.expected_time = expected_time;
    this.ascent = ascent;
    this.difficulty = difficulty;
    this.start_point_idPoint = start_point;
    this.end_point_idPoint = end_point;
    this.description = description;
    this.gpx_track = gpx_track;
    this.picture = picture;
    this.hike_condition = hike_condition;
    this.hike_condition_description = hike_condition_description;
    this.local_guide = local_guide;
  }

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
    hike.start_point_address = address;
    hike.start_point_nameLocation = location;
    hike.start_point_coordinates = coordinates;
    hike.start_point_type = type;
  }

  function setEndPoint(hike, address, location, coordinates, type) {
    hike.end_point_address = address;
    hike.end_point_nameLocation = location;
    hike.end_point_coordinates = coordinates;
    hike.end_point_type = type;
  }

  test('test readHikes', async () => {
    const data = await dao.readHikes();
    const hike1 = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(hike1, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(hike1, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
      "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
      "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    const hikes_checks = [hike1, hike2];
    expect(data).toEqual(hikes_checks);
  });

  test('test getHikeByTitle', async () => {
    const data = await dao.getHikeByTitle('Hike#1');
    const hike1 = {
      title: 'Hike#1', length: 5.0, expected_time: 5, ascent: 5.0, difficulty: 'Tourist',
      start_point: 1, end_point: 2, reference_points: '2-3', description: 'First easy example hike',
      gpx_track: rocciamelone, picture: null, hike_condition: null, hike_condition_description: null,
      local_guide: 'paulina.knight@gmail.com'
    }
    expect(data).toEqual(hike1);
  });

  test('test deleteHike', async () => {
    let data = await dao.readHikes();
    const hike1 = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(hike1, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(hike1, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
      "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
      "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    const hikes_checks = [hike1, hike2];
    expect(data).toEqual(hikes_checks);
    const check = await dao.deleteHike(hike1.title);
    expect(check).toBe(true);
    data = await dao.readHikes();
    expect(data).toEqual([hike2]);
  });

  test('test addHike', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    let hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.addHike(hike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    hike = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(hike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(hike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    expect(data).toEqual([hike]);
  });

  test('test addHike, double insert', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.addHike(hike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    const hike_noRef = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(hike_noRef, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(hike_noRef, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    expect(data).toEqual([hike_noRef]);
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Hikes.title");
    }
  });

  test('test addHike wrong number of fields', async () => {   //also valid for wrong gpx_track
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.gpx_track");    //the last field is always gpx_track
    }
  });

  test('test addHike wrong title', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint(null, 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.title");
    }
  });

  test('test addHike wrong length', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', null, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.length");
    }
  });

  test('test addHike wrong expected_time', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, null, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.expected_time");
    }
  });

  test('test addHike wrong ascent', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, null, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.ascent");
    }
  });

  test('test addHike wrong difficulty', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, null, 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.difficulty");
    }
  });

  test('test addHike wrong start_point', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', null, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.start_point");
    }
  });

  test('test addHike wrong end_point', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, null, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.end_point");
    }
  });

  test('test addHike wrong description', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', null, rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.description");
    }
  });

  test('test addHike wrong reference points', async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Hikes');
    const hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, null, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await dao.addHike(hike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.reference_points");
    }
  });

  test('test readListOfReferencesPoints', async () => {
    const hike = new Hike('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const ref = await dao.readListOfReferencePoints(hike.title);
    const check = [2, 3];
    expect(check[0]).toEqual(ref[0].idPoint);
    expect(check[1]).toEqual(ref[1].idPoint);
  });

  test('test updateHike', async () => {               
    let newHike = new HikeWithFormatNo_idPoint('Hike#5', 7.0, 5, 6.0, 'Tourist', 1, 2, '2-3-4', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#5', 7.0, 5, 6.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeTitle', async () => {     
    let newHike = new HikeWithFormatNo_idPoint('Hike#5', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#5', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeLength', async () => {     
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 9.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#1', 9.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeET', async () => {     
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 15, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#1', 5.0, 15, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeAscent', async () => {     
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 7.8, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#1', 5.0, 5, 7.8, 'Tourist', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeDifficulty', async () => {     
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Hiker', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Hiker', 1, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeStartPoint', async () => {     
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 3, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 3, 2, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
      "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeEndPoint', async () => {         
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 4, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 4, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Vinadio, Cuneo, Piedmont, Italy",
      "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHikeRefPoints', async () => {     
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3-4', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
  });

  test('test updateHikeDescription', async () => {               
    let newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'Second easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'Second easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant, null, null, null, 'mario.rossi@gmail.com');
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

  test('test updateHike wrong number of fields', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.gpx_track");  
    }
  });

  test('test updateHike wrong title', async () => {
    const newHike = new HikeWithFormatNo_idPoint(null, 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.title");  
    }
  });

  test('test updateHike wrong length', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', null, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.length");  
    }
  });

  test('test updateHike wrong expected_time', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, null, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.expected_time");  
    }
  });

  test('test updateHike wrong ascent', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, null, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.ascent");  
    }
  });

  test('test updateHike wrong difficulty', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, null, 1, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.difficulty");  
    }
  });

  test('test updateHike wrong start_point', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', null, 2, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.start_point");  
    }
  });

  test('test updateHike wrong end_point', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, null, '2-3', 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.end_point");  
    }
  });

  test('test updateHike wrong description', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', null, rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.description");  
    }
  });

  test('test updateHike wrong reference points', async () => {
    const newHike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, null, 'First easy example hike', rocciamelone, null, null, null, 'paulina.knight@gmail.com');
    try {
      await await dao.updateHike(1, newHike);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Hikes.reference_points");  
    }
  });

});