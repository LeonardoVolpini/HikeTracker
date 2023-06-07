'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

describe("HikerHike test", () => {
  beforeEach(async () => {
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
  });

  afterAll(async () => {
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
  });

  function RowStart(hiker, hike, start_time) {
    this.hiker = hiker;
    this.hike = hike;
    this.start_time = start_time;
  }

  function Row(hiker, hike, start_time, end_time) {
    this.hiker = hiker;
    this.hike = hike;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  function Statistics(hiker, hike, times_completed, best_time){
    this.hiker = hiker;
    this.hike = hike;
    this.times_completed = times_completed;
    this.best_time = best_time;
  }

  function StatisticsNoHiker(hike, times_completed, best_time){
    this.hike = hike;
    this.times_completed = times_completed;
    this.best_time = best_time;
  }

  function StatisticsNoTimesCompl(hiker, hike, best_time){
    this.hiker = hiker;
    this.hike = hike;
    this.best_time = best_time;
  }

  test('test startHike', async () => {
    await testDao.run('DELETE FROM HikerHike');
    let start = new RowStart('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00');
    const check = await dao.startHike(start.hiker, start.hike, start.start_time);
    expect(check).toBe(true);
  });
  
  test('test startHike wrong number of fields', async () => {   
    await testDao.run('DELETE FROM HikerHike');
    const start = new RowStart('mario.rossi@gmail.com', '15.00');
    try {
      await dao.startHike(start.hiker, start.hike, start.start_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.start_time");
    }
  });

  test('test startHike wrong hiker', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const start = new RowStart(null, 'Form Pian Belota to la Vacca', '15.00');
    try {
      await dao.startHike(start.hiker, start.hike, start.start_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hiker");
    }
  });

  test('test startHike wrong hike', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const start = new RowStart('mario.rossi@gmail.com', null, '15.00');
    try {
      await dao.startHike(start.hiker, start.hike, start.start_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hike");
    }
  });

  test('test updateEndTime', async () => {
    const end = new Row('mario.rossi@gmail.com', 'Hike Monte Thabor', '12.00', '14.00');
    const check = await dao.updateHikeEndTime(end.hiker, end.hike, end.start_time, end.end_time);
    expect(check).toBe(true);
  });

  test('test updateEndTime wrong hiker', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const end = new Row(null, 'Hike Monte Thabor', '12.00', '14.00');
    try {
      await dao.startHike(end.hiker, end.hike, end.end_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hiker");
    }
  });

  test('test updateEndTime wrong hike', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const end = new Row('mario.rossi@gmail.com', null, '12.00', '14.00');
    try {
      await dao.updateHikeEndTime(end.hiker, end.hike, end.start_time, end.end_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hike");
    }
  });

  test('test endHike', async () => {
    await testDao.run('DELETE FROM HikerHikeStatistics');
    const end = new StatisticsNoTimesCompl('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 60);
    const check = await dao.endHike(end.hiker, end.hike, end.best_time);
    expect(check).toBe(true);
    const data = await dao.getFinishedHikes();
    const r1 = new Statistics('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 1, 60);
    const hikes_check = [r1];
    expect(data).toEqual(hikes_check);
  });

  test('test endHike wrong hiker', async () => {   
    await testDao.run('DELETE FROM HikerHikeStatistics');
    const end = new StatisticsNoTimesCompl(null, 'Form Pian Belota to la Vacca', 60);
    try {
      await dao.endHike(end.hiker, end.hike, end.best_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHikeStatistics.hiker");
    }
  });

  test('test endHike wrong hiker', async () => {   
    await testDao.run('DELETE FROM HikerHikeStatistics');
    const end = new StatisticsNoTimesCompl('mario.rossi@gmail.com', null, 60);
    try {
      await dao.endHike(end.hiker, end.hike, end.best_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHikeStatistics.hike");
    }
  });

  test('test updateEndHikeBestTime', async () => {
    const end = new StatisticsNoTimesCompl('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 50);
    const check = await dao.updateEndHikeBestTime(end.hiker, end.hike, end.best_time);
    expect(check).toBe(true);
    const data = await dao.getFinishedHikes();
    const r1 = new Statistics('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 3, 50);
    const r2 = new Statistics('mario.rossi@gmail.com', 'Hike Monte Thabor', 6, 30);
    const hikes_check = [r1,r2];
    expect(data).toEqual(hikes_check);
  });

  test('test updateEndHikeBestTime wrong hiker', async () => {
    const end = new StatisticsNoTimesCompl(null, 'Form Pian Belota to la Vacca', 50);
    try {
      await dao.updateEndHikeBestTime(end.hiker, end.hike, end.best_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHikeStatistics.hiker");
    }
  });

  test('test updateEndHikeBestTime wrong hike', async () => {
    const end = new StatisticsNoTimesCompl('mario.rossi@gmail.com', null, 50);
    try {
      await dao.updateEndHikeBestTime(end.hiker, end.hike, end.best_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHikeStatistics.hiker");
    }
  });

  test('test updateEndHikeNoBestTime', async () => {
    const end = {hiker: 'mario.rossi@gmail.com', hike: 'Form Pian Belota to la Vacca'};
    const check = await dao.updateEndHikeNoBestTime(end.hiker, end.hike);
    expect(check).toBe(true);
    const data = await dao.getFinishedHikes();
    const r1 = new Statistics('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 3, 60);
    const r2 = new Statistics('mario.rossi@gmail.com', 'Hike Monte Thabor', 6, 30);
    const hikes_check = [r1,r2];
    expect(data).toEqual(hikes_check);
  });

  test('test updateEndHikeNoBestTime wrong hiker', async () => {
    const end = {hiker: null, hike: 'Form Pian Belota to la Vacca'};
    try {
      await dao.updateEndHikeBestTime(end.hiker, end.hike, end.best_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHikeStatistics.hiker");
    }
  });

  test('test updateEndHikeBestTime wrong hiker', async () => {
    const end = {hiker: 'mario.rossi@gmail.com', hike: null};
    try {
      await dao.updateEndHikeBestTime(end.hiker, end.hike, end.best_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHikeStatistics.hiker");
    }
  });

  test('test getBestTime', async () => {
    const best = {best_time: 60};
    const data = await dao.getBestTime('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca');
    expect(data).toEqual(best);
  });

  test('test checkFirstEnd', async () => {
    let data = await dao.checkFirstEnd('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca');
    expect(data).toEqual(1);
    data = await dao.checkFirstEnd('prova@gmail.com', 'Form Pian Belota to la Vacca');
    expect(data).toEqual(0);
  });

  test('test getOnGoingHike', async () => {
    const r2 = new Row('mario.rossi@gmail.com', 'Hike Monte Thabor', '12.00', null); 
    const data = await dao.getOnGoingHike('mario.rossi@gmail.com');
    const hike_check = [{hike: 'Hike Monte Thabor', start_time:'12.00'}];
    expect(data).toEqual(hike_check);
  });

  test('test getFinishedHikes', async () => {
    const r1 = new Statistics('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 2, 60);
    const r2 = new Statistics('mario.rossi@gmail.com', 'Hike Monte Thabor', 6, 30);
    const data = await dao.getFinishedHikes();
    const hikes_check = [r1,r2];
    expect(data).toEqual(hikes_check);
  });

  test('test getDistinctFinishedHikes', async () => {
    const r1 = new Statistics('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 2, 60);
    const r2 = new Statistics('mario.rossi@gmail.com', 'Hike Monte Thabor', 6, 30);
    let data = await dao.getDistinctFinishedHikes();
    const hikes_check = [{hike: r1.hike},{hike: r2.hike}];
    expect(data).toEqual(hikes_check);
    await dao.updateEndHikeNoBestTime('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca');
    data = await dao.getDistinctFinishedHikes();
    expect(data).toEqual(hikes_check);
  });

  test('test getFinishedHikesByHiker', async () => {
    const r1 = new StatisticsNoHiker('Form Pian Belota to la Vacca', 2, 60);
    const r2 = new StatisticsNoHiker('Hike Monte Thabor', 6, 30);
    let data = await dao.getFinishedHikesByHiker('mario.rossi@gmail.com');
    const hikes_check = [r1,r2];
    expect(data).toEqual(hikes_check);
    await dao.endHike('prova@gmail.com', 'Form Pian Belota to la Vacca', 40);
    data = await dao.getFinishedHikesByHiker('mario.rossi@gmail.com');
    expect(data).toEqual(hikes_check);
  });

});