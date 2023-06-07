'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('hikeTracker.db', (err) => {
  if (err) {
    throw err;
  }
});

function run(stmt, params) {
  return new Promise((resolve, reject) => {
    db.run(stmt, params, (error) => {
      if (error) {
        return reject(error.message);
      }
      return resolve(true);
    });
  })
}

async function login(email, password) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Users WHERE email = ?`;
    db.get(sql, email, (err, row) => {
      if (err) {
        reject(err);
      }
      else if (row === undefined)
        resolve(false); 
      else {
        const user = {
          email: row.email,
          name: row.name,
          lastname: row.lastname,
          role: row.role,
          phone_number: row.phone_number
        }

        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) {
            resolve(false);
          }
          else {
            resolve(user);
          }
        });
      }
    });
  });
}

module.exports = {
  run, login
};