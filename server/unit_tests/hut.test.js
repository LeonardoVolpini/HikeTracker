'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

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
                    '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', null),
                    (2, "Hut#1",
                    '3209987875', 'test@gmail.com', 'www.test.com', 'Testing hut', null)`);
  });

  afterAll(async () => {
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
                    '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', null),
                    (2, "Hut#1",
                    '3209987875', 'test@gmail.com', 'www.test.com', 'Testing hut', null)`);
    await testDao.run("INSERT OR IGNORE INTO HikePoint(idPoint, titleHike)\
                    VALUES ('4', 'Hike#1'), \
                    ('3', 'Hike#2'), \
                    ('1', 'Hike#2'), \
                    ('1', 'Hike#1')");
  });

  function HutNameLocation(idHut, nameHut, phone, email, web_site, description, picture) {
    this.idHut = idHut;
    this.nameLocation = nameHut;
    this.phone = phone;
    this.email = email;
    this.web_site = web_site;
    this.description = description;
    this.picture = picture;
  }

  function HutPoint(idPoint, address, nameLocation, gps_coordinates, type, capacity, altitude, idHut, nameHut, phone, email, web_site, description, picture) {
    this.idPoint = idPoint;
    this.address = address;
    this.nameLocation = nameLocation;
    this.gps_coordinates = gps_coordinates;
    this.type = type;
    this.capacity = capacity;
    this.altitude = altitude;
    this.idHut = idHut;
    this.nameHut = nameHut;
    this.phone = phone;
    this.email = email;
    this.web_site = web_site;
    this.description = description;
    this.picture = picture;
  }

  // need to change, for now in db there is inconsistency between the huts in Points table and huts in Huts table
  test('test readHuts', async () => {
    const data = await dao.readHuts();
    const p1 = new HutPoint(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
      'Hut#1', '45.177786,7.083372', 'Hut', null, null, 2, 'Hut#1', '3209987875', 'test@gmail.com', 'www.test.com', 'Testing hut', null);
    const points_check = [p1];
    expect(data).toEqual(points_check);
  });

  // need to change, for now in db there is inconsistency between the huts in Points table and huts in Huts table
  test('test addHut', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const hut = new HutNameLocation(1, "Strada Provinciale 53 di Val d'Orcia", '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', null);
    const check = await dao.addHut(hut);
    expect(check).toBe(undefined);	//this.lastid
  });

  test('test addHut, double insert', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const hut = new HutNameLocation(1, "Strada Provinciale 53 di Val d'Orcia", '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', null);
    const check = await dao.addHut(hut);
    expect(check).toBe(undefined);	//this.lastId
    try {
      await dao.addHut(hut);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Huts.nameHut");
    }
  });

  test('test addPoint wrong number of fields', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const hut = new HutNameLocation(1, '3333071117', 'caggianomarta98@gmail.com', 'ciao@gmail.com', 'Nice hut in Siena');
    try {
      await dao.addHut(hut);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Huts.description");
    }
  });

  test('test addPoint wrong id', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const hut = new HutNameLocation(null, "Strada Provinciale 53 di Val d'Orcia", '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', null);
    try {
      await dao.addHut(hut);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Huts.idHut");
    }
  });

  test('test addPoint wrong nameHut', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const hut = new HutNameLocation(1, null, '3333071117', 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', null);
    try {
      await dao.addHut(hut);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Huts.nameHut");
    }
  });

  test('test addPoint wrong phone', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const hut = new HutNameLocation(1, "Strada Provinciale 53 di Val d'Orcia", null, 'caggianomarta98@gmail.com', null, 'Nice hut in Siena', null);
    try {
      await dao.addHut(hut);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Huts.phone");
    }
  });

  test('test addPoint wrong email', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Huts');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const hut = new HutNameLocation(1, "Strada Provinciale 53 di Val d'Orcia", '3333071117', null, null, 'Nice hut in Siena', null);
    try {
      await dao.addHut(hut);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Huts.email");
    }
  });

});