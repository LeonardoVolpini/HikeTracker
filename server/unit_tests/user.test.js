'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

describe("User test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM Users');
    await testDao.run("INSERT OR IGNORE INTO Users(email, password, role, name, lastname, phone_number, salt)\
            VALUES ('mario.rossi@gmail.com', \
            'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe', \
            'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec'),\
            ('paulina.knight@gmail.com', \
            'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1', \
            'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699')");
  });

  afterAll(async () => {
    await testDao.run('DELETE FROM Users');
    await testDao.run("INSERT OR IGNORE INTO Users(email, password, role, name, lastname, phone_number, salt)\
            VALUES ('mario.rossi@gmail.com', \
            'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe', \
            'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec'),\
            ('paulina.knight@gmail.com', \
            'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1', \
            'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699')");
  });

  function User(email, password, role, name, lastname, phone_number, salt) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.name = name;
    this.lastname = lastname;
    this.salt = salt;
    this.phone_number = phone_number;
  }

  test('test readUsers', async () => {
    const data = await dao.readUsers();
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const pauline = new User('paulina.knight@gmail.com',
      'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
      'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
    const users_check = [mario, pauline];
    expect(data).toEqual(users_check);
  });

  test('test deleteUser', async () => {
    const data = await dao.readUsers();
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const pauline = new User('paulina.knight@gmail.com',
      'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
      'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
    const users_check = [mario, pauline];
    expect(data).toEqual(users_check);
    const check = await dao.deleteUser(pauline.email);
    expect(check).toBe(true);
    const newData = await dao.readUsers();
    expect(data).not.toEqual(newData);
  });

  test('test addUser', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const check = await dao.addUser(mario.email, mario.password, mario.role, mario.name, mario.lastname, mario.phone_number, mario.salt);
    expect(check).toBe(true);
    const data = await dao.readUsers();
    const users_check = [mario];
    expect(data).toEqual(users_check);
  });

  test('test addUser, double insert', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const check = await dao.addUser(mario.email, mario.password, mario.role, mario.name, mario.lastname, mario.phone_number, mario.salt);
    expect(check).toBe(true);
    const data = await dao.readUsers();
    const users_check = [mario];
    expect(data).toEqual(users_check);
    try {
      await dao.addUser(mario.email, mario.password, mario.role, mario.name, mario.lastname, mario.phone_number, mario.salt);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.email");
    }  
  });

  test('test addUser wrong number of fields', async () => {   //also valid for wrong salt
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    try {
      await dao.addUser(mario.email, mario.role, mario.name, mario.lastname, mario.phone_number, mario.salt);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Users.salt");    //the last field is always salt
    }
  });

  test('test addUser wrong email', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
      try {
        await dao.addUser(null, mario.password, mario.role, mario.name, mario.lastname, mario.phone_number, mario.salt);
      } catch (error) {
        expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Users.email"); 
      }
  });

  test('test addUser wrong password', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
      try {
        await dao.addUser(mario.email, null, mario.role, mario.name, mario.lastname, mario.phone_number, mario.salt);
      } catch (error) {
        expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Users.password"); 
      }
  });

  test('test addUser wrong role', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
      try {
        await dao.addUser(mario.email, mario.password, null, mario.name, mario.lastname, mario.phone_number, mario.salt);
      } catch (error) {
        expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Users.role"); 
      }
  });

  test('test addUser wrong name', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
      try {
        await dao.addUser(mario.email, mario.password, mario.role, null, mario.lastname, mario.phone_number, mario.salt);
      } catch (error) {
        expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Users.name"); 
      }
  });

  test('test addUser wrong lastname', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
      try {
        await dao.addUser(mario.email, mario.password, mario.role, mario.name, null, mario.phone_number, mario.salt);
      } catch (error) {
        expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Users.lastname"); 
      }
  });

  test('test addUser wrong phone number', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
      try {
        await dao.addUser(mario.email, mario.password, mario.role, mario.name, mario.lastname, null, mario.salt);
      } catch (error) {
        expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Users.phone_number"); 
      }
  });

  test('test updateUserRole', async () => {
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const check = await dao.updateUserRole(mario.email, "LocalGuide");
    expect(check).toBe(true);
    const data = await dao.readUsers();
    const user_check = data[0];
    expect(user_check.role).not.toBe("Hiker");
    expect(user_check.role).toBe("LocalGuide");
  });

  test('test getUserByEmail', async () => {
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const data = await dao.getUserByEmail(mario.email);
    const users_check = mario;
    expect(data).toEqual(users_check);
  });

  test('test getUserByEmail without match', async () => {
    const data = await dao.getUserByEmail('email');
    const check = "NOT found";
    expect(data.error).toEqual(check);
  });

});