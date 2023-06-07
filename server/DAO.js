'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('hikeTracker.db', (err) => {
  if (err) {
    throw err;
  }
});

/*************USERS CRUD************/
function readUsers() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Users WHERE email=?';
    db.get(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      }
      if (rows == undefined)
        resolve({ error: 'NOT found' });
      else {
        resolve(rows);
      }
    });
  });
}

function addUser(email, password, role, name, lastname, phone_number, salt) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO USERS (email, password, role, name, lastname, phone_number, salt) VALUES(?,?,?,?,?,?,?)';
    db.run(sql, email, password, role, name, lastname, phone_number, salt, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updateUserRole(email, role) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE USERS SET role = ? where email = ?';
    db.run(sql, role, email, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function deleteUser(email) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM USERS WHERE email = ?';
    db.run(query, email, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

/*************HIKES CRUD************/

function readHikes() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT title,
        length,
        expected_time,
        ascent,
        difficulty,
        description,
        gpx_track,
        picture,
        hike_condition,
        hike_condition_description,
        local_guide,
        SP.idPoint AS start_point_idPoint,
        SP.address AS start_point_address,
        SP.nameLocation AS start_point_nameLocation,
        SP.gps_coordinates AS start_point_coordinates,
        SP.type AS start_point_type,
        EP.idPoint AS end_point_idPoint,
        EP.address AS end_point_address,
        EP.nameLocation AS end_point_nameLocation,
        EP.gps_coordinates AS end_point_coordinates,
        EP.type AS end_point_type
      FROM Hikes
      JOIN Points SP
      ON Hikes.start_point = SP.idPoint
      JOIN Points EP
      ON Hikes.end_point = EP.idPoint
      ;
    `;
    db.all(sql, (err, hikes) => {
      if (err) {
        reject(err);
      } else {
        resolve(hikes)
      }
    });
  });
}

function getHikeByTitle(title) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Hikes
      WHERE title = ?
      ;
    `;
    db.get(sql, title, (err, hike) => {
      if (err) {
        reject(err);
      } else {
        resolve(hike)
      }
    });
  });
}

function readListOfReferencePoints(title) { // RP for a given hike
  return new Promise((resolve, reject) => {
    const sql = `SELECT *
    FROM HikePoint HP, Points P
    WHERE P.idPoint = HP.idPoint AND HP.titleHike = ?`;
    db.all(sql, [title], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const newRp = rows.map(rp =>{
          return {nameLocation: rp.PnameLocation, address: rp.address, latlng:{lat:rp.gps_coordinates.split(',')[0],lng:rp.gps_coordinates.split(',')[1]},altitude:rp.altitude}
        });
        resolve(newRp)
      }
    });
  });
}

function addHike(hike) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO HIKES (title, length, expected_time, ascent, difficulty, start_point, end_point, description, reference_points, gpx_track, picture, hike_condition, local_guide) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.run(sql, hike.title, hike.length, hike.expected_time, hike.ascent, hike.difficulty, hike.start_point, hike.end_point, hike.description, hike.reference_points, hike.gpx_track, hike.picture, hike.hike_condition, hike.local_guide, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updateHikeTitle(oldName, newName) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET title = ? where title = ?';
    db.run(sql, newName, oldName, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updateHikeLength(title, length) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET length = ? where title = ?';
    db.run(sql, length, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeET(title, expected_time) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET expected_time = ? where title = ?';
    db.run(sql, expected_time, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeAscent(title, ascent) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET ascent = ? where title = ?';
    db.run(sql, ascent, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeDifficulty(title, difficulty) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET difficulty = ? where title = ?';
    db.run(sql, difficulty, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeStartPoint(title, start_point) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET start_point = ? where title = ?';
    db.run(sql, start_point, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeEndPoint(title, end_point) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET end_point = ? where title = ?';
    db.run(sql, end_point, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeRefPoint(title, reference_points) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET reference_points = ? where title = ?';
    db.run(sql, reference_points, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeDescription(title, description) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET description = ? where title = ?';
    db.run(sql, description, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHike(oldHikeTitle, newHike) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET title = ?, length = ?, expected_time = ?, ascent = ?, difficulty = ?, start_point = ?, end_point = ?, description = ?, hike_condition =?, hike_condition_description = ?, local_guide = ? where title = ?';
    db.run(sql, newHike.title, newHike.length, newHike.expected_time, newHike.ascent, newHike.difficulty, newHike.start_point, newHike.end_point, newHike.description, newHike.hike_condition, newHike.hike_condition_description, newHike.local_guide, oldHikeTitle, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function deleteHike(title) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM HIKES WHERE title = ?';
    db.run(query, title, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

/*************POINTS CRUD************/

function readPoints() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readPointById(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS WHERE idPoint = ?';
    db.get(sql, id, (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined)
        resolve({ error: 'NOT found' });
      else {
        resolve(row);
      }
    });
  });
}

//It checks if the address exists
function checkPresenceByAddress(addr) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT idPoint FROM POINTS WHERE address = ?';
    db.get(sql, addr, (err, id) => {
      if (err) {
        reject(err);
      }
      if (id == undefined) {
        resolve(null);
      }
      else {
        resolve(id);
      }
    });
  });
}

//It checks if the gps_coordiantes exists
function checkPresenceByCoordinates(coord) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT idPoint FROM POINTS WHERE gps_coordinates = ?';
    db.get(sql, coord, (err, id) => {
      if (err) {
        reject(err);
      }
      if (id == undefined) {
        resolve(null);
      }
      else {
        resolve(id);
      }
    });
  });
}

function addPoint(point) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Points (address, nameLocation, gps_coordinates, type, capacity, altitude) VALUES(?,?,?,?,?,?)';
    db.run(sql, [point.address, point.nameLocation, point.gps_coordinates, point.type, point.capacity, point.altitude],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
  });
}

function updatePoint(oldIdPoint, newPoint) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET address = ?, nameLocation = ?, gps_coordinates = ?, type = ?, capacity = ?, altitude = ? where idPoint = ?';
    db.run(sql, newPoint.address, newPoint.nameLocation, newPoint.gps_coordinates, newPoint.type, newPoint.capacity, newPoint.altitude, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function deletePoint(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM POINTS WHERE idPoint = ?';
    db.run(query, id, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

function updatePointAddress(oldIdPoint, address) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET address = ? where idPoint = ?';
    db.run(sql, address, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointLocation(oldIdPoint, location) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET nameLocation = ? where idPoint = ?';
    db.run(sql, location, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointGpsCoordinates(oldIdPoint, gps_coordinates) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET gps_coordinates = ? where idPoint = ?';
    db.run(sql, gps_coordinates, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointType(oldIdPoint, type) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET type = ? where idPoint = ?';
    db.run(sql, type, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointCapacity(oldIdPoint, capacity) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET capacity = ? where idPoint = ?';
    db.run(sql, capacity, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointAltitude(oldIdPoint, altitude) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET altitude = ? where idPoint = ?';
    db.run(sql, altitude, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

/************* HUTS ************/

function readHuts() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS P, HUTS H where type = ? and P.nameLocation = H.nameHut';
    db.all(sql, "Hut", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addHut(hut) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO HUTS (nameHut, phone, email, web_site, description, picture) VALUES(?,?,?,?,?,?)';
    db.run(sql, hut.nameLocation, hut.phone, hut.email, hut.web_site, hut.description, hut.picture,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastId);
        }
      });
  });
}


/*************Verification Code************/

function addCode(email, code,name,lastName,role,password,phoneNumber) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Verification_Code (email,code,name,lastName,role,password,phoneNumber) VALUES(?,?,?,?,?,?,?)';
    db.run(sql, email, code, name, lastName,role,password,phoneNumber, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function getCode(email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Verification_Code where email = ?';
    db.get(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      }
      if (rows == undefined)
        resolve({ error: 'NOT found' });
      else {
        resolve(rows);
      }
    });
  });
}

function deleteCode(email) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM Verification_Code WHERE email = ?';
    db.run(query, [email], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

function updateCode(email, code) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Verification_Code SET code = ? where email = ?';
    db.run(sql, code, email, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function getAllRequests() {
  return new Promise((resolve,reject)=>{
    const sql = "SELECT * FROM Verification_Code WHERE role<>'Hiker'";
    db.all(sql,(err,rows)=>{
      if(err){
        reject (err);
        return;
      }
      resolve (rows)
    });
  });
}


/*************HikerHike functions************/

//add the starting hike in the HikerHike table without end_time
function startHike(hiker_email, hike_title, start_time) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO HikerHike (hiker, hike, start_time) VALUES(?,?,?)';
    db.run(sql, hiker_email, hike_title, start_time, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

//also start_time because the same hiker can do the same hike multiple times
function updateHikeEndTime(hiker_email, hike_title, start_time, end_time) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HikerHike SET end_time = ? WHERE hiker = ? and hike = ? and start_time = ?';
    db.run(sql, end_time, hiker_email, hike_title, start_time, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

//when an hike was terminate for the first time add a row in HikerHikeStatistics
function endHike(hiker_email, hike_title, duration) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO HikerHikeStatistics (hiker, hike, times_completed, best_time) VALUES(?,?,1,?)';
    db.run(sql, hiker_email, hike_title, duration, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

//when an hike was terminate not for the first time update a row in HikerHikeStatistics
function updateEndHikeBestTime(hiker_email, hike_title, duration) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HikerHikeStatistics SET times_completed = times_completed + 1, best_time = ? WHERE hiker = ? and hike = ?';
    db.run(sql, duration, hiker_email, hike_title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

//when an hike was terminate not for the first time update a row in HikerHikeStatistics
function updateEndHikeNoBestTime(hiker_email, hike_title) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HikerHikeStatistics SET times_completed = times_completed + 1 WHERE hiker = ? and hike = ?';
    db.run(sql, hiker_email, hike_title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function getBestTime(hiker_email, hike_title) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT best_time FROM HikerHikeStatistics WHERE hiker = ? AND hike = ?';
    db.get(sql, hiker_email, hike_title, (err, row) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(row);
      }
    });
  });
}

function checkFirstEnd(hiker_email, hike_title) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HikerHikeStatistics WHERE hiker = ? AND hike = ?';
    db.get(sql, hiker_email, hike_title, (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined)
        resolve(0); //first time
      else {
        resolve(1); //not first time
      }
    });
  });
}

//Returns the ongoing hike of a specific hiker
function getOnGoingHike(hiker_email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT hike, start_time FROM HikerHike WHERE hiker = ? AND start_time IS NOT NULL AND end_time IS NULL';
    db.all(sql, hiker_email, (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(rows);
      }
    });
  });
}

//Returns all hikes that are finished, even duplicates if, for example, the same hike was completed by two or more different hikers
function getFinishedHikes() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HikerHikeStatistics';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

//Returns all hikes that are finished, eliminating duplicates 
function getDistinctFinishedHikes() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT DISTINCT(hike) FROM HikerHikeStatistics'; 
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

//Returns all hikes that are finished by a specific hiker
function getFinishedHikesByHiker(hiker_email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT hike, times_completed, best_time FROM HikerHikeStatistics WHERE hiker = ?';
    db.all(sql, hiker_email, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
function updateHikerHike_Hike(oldHike,newHike) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HikerHike SET hike = ? WHERE hike = ?';
    db.run(sql, newHike,oldHike, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikerHikeStatistics_Hike(oldHike,newHike) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HikerHikeStatistics SET hike = ? WHERE hike = ?';
    db.run(sql, newHike,oldHike, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

//---------------- HikePoints ----------------------------

function getHikePoint() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HikePoint';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addHikePoint(idPoint, titleHike,nameLocation) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO HikePoint (idPoint, titleHike,PnameLocation) VALUES(?,?,?)';
    db.run(sql, idPoint, titleHike, nameLocation, (err, rows) => {
      if (err) {
        reject(err);
      }else{
        resolve(idPoint)
      }
    })
  })
}

function deleteHikePoint_Hike(titleHike)  {
  /*
    Delete every relationship ship for a hike
  */
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM HikePoint WHERE titleHike = ?;';
    db.run(query, titleHike, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

function getHikePointByTitle(titleHike) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HikePoint WHERE titleHike = ?';
    db.all(sql, titleHike, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}


//-----------------------HutsLinkedHike----------------------
function addLinkedHut(idHut, titleHike) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO HikeHut (idHut, titleHike) VALUES(?,?)';
    db.run(sql, idHut, titleHike, (err, rows) => {
      if (err) {
        reject(err);
      }else{
        resolve(idHut)
      }
    })
  })
}
function getHutsLinkedByTitle(titleHike) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT address,nameLocation,gps_coordinates,capacity,altitude FROM HikeHut HH, Points P, Huts H WHERE HH.idHut==H.idHut AND P.nameLocation == H.nameHut AND titleHike = ?';
    db.all(sql, titleHike, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function deleteLinkedHut_byTitle(titleHike)  {
  /*
    Delete every relationship ship for a hike
  */
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM HikeHut WHERE titleHike = ?;';
    db.run(query, titleHike, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
module.exports = {
  readUsers, addUser, deleteUser, updateUserRole, getUserByEmail,
  readHikes, addHike, deleteHike, updateHike, updateHikeTitle, getHikeByTitle,
  updateHikeAscent, updateHikeLength, updateHikeDescription, updateHikeDifficulty,
  updateHikeET, updateHikeStartPoint, updateHikeEndPoint, updateHikeRefPoint,
  readPoints, checkPresenceByAddress, checkPresenceByCoordinates, addPoint, updatePoint, deletePoint, readHuts, addHut,
  addCode, deleteCode, getCode, updateCode,
  updatePointAddress, updatePointGpsCoordinates, updatePointLocation, updatePointType, updatePointCapacity, updatePointAltitude,
  readListOfReferencePoints, readPointById,
  startHike, updateHikeEndTime, getOnGoingHike, getFinishedHikes, getDistinctFinishedHikes, getFinishedHikesByHiker,
  endHike, updateEndHikeBestTime, updateEndHikeNoBestTime, getBestTime, checkFirstEnd,
  getHikePoint, addHikePoint, deleteHikePoint_Hike, getHikePointByTitle, addLinkedHut, getHutsLinkedByTitle, deleteLinkedHut_byTitle,
  updateHikerHike_Hike, updateHikerHikeStatistics_Hike,getAllRequests
};