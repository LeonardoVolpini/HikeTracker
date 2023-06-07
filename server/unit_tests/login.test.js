'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

describe("Login test", () => {

	beforeEach(async () => {
		await testDao.run('DELETE FROM Users');
	});

	afterAll(async () => {
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

	test('login with an existing user', async () => {
		const pauline = new User('paulina.knight@gmail.com',
			'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
			'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
		await dao.addUser(pauline.email, pauline.password, pauline.role, pauline.name, pauline.lastname, pauline.phone_number, pauline.salt);
		const check = await testDao.login(pauline.email, "hello13");
		expect(check.email).toBe('paulina.knight@gmail.com');
		expect(check.name).toBe('Paulina');
		expect(check.lastname).toBe('Knight');
		expect(check.role).toBe('LocalGuide');
		expect(check.phone_number).toBe('+39 3276958421');
	});

	test('login with wrong password', async () => {
		const pauline = new User('paulina.knight@gmail.com',
			'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
			'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
		await dao.addUser(pauline.email, pauline.password, pauline.role, pauline.name, pauline.lastname, pauline.phone_number, pauline.salt);
		const check = await testDao.login(pauline.email, 'prova');
		expect(check).toBe(false);
	});

	test('login with wrong email', async () => {
		const pauline = new User('paulina.knight@gmail.com',
			'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
			'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
		await dao.addUser(pauline.email, pauline.password, pauline.role, pauline.name, pauline.lastname, pauline.phone_number, pauline.salt);
		const check = await testDao.login('pauline.email', 'hello13');
		expect(check).toBe(false);
	});

	test('login with a non existing user', async () => {
		const pauline = new User('paulina.knight@gmail.com',
			'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
			'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
		const check = await testDao.login(pauline.email, pauline.password);
		expect(check).toBe(false);
	});

});