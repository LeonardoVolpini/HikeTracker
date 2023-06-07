'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open database
const db = new sqlite.Database('hikeTracker.db', (err) => {
  if (err) throw err;
});

exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // by default, the local strategy looks for "username": 
        // not to create confusion in server.js, we can create an object with that property
        const user = { username: row.email, name: row.name, lastname: row.lastname, role: row.role, phone_number: row.phone_number }
        resolve(user);
      }
    });
  });
};

//4.1 STEP PASSPORT-->Check credentials and HASHING PASSWORD with Node's crypto modules
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS WHERE email = ?';

    db.get(sql, [email], (err, row) => {

      if (err) {

        reject(err);
      }
      else if (row === undefined) {
        resolve(false);
      }
      else {
        const user = { username: row.email, name: row.name, lastname: row.lastname, role: row.role, phone_number: row.phone_number }; //NOTA BENE-->QUI NON DOBBIAMO METTERE LA PASSWORD!!-->vedi dopo perchè dobbiamo salvarla come HASH
        //4.2 STEP PASSPORT-->HASHING PASSWORD
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          //4.3 STEP PASSPORT-->CHECK IF HASHED PASSWORD==STORED PASSWORD
          if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)){
            resolve(false);
          }
          else
            resolve(user);//Adesso ritorna al "server.js" per verificare come funziona il return cb(null,user)
        });
      }
    });
  });
};
