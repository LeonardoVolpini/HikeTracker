const express = require('express');
const router = express.Router();
const { validationResult, body, param } = require('express-validator');
const c = require('./hikeController');

router.get('/getHikes', async (req, res) => {
  try {
    const hikes = await c.getHikes();
    //console.log(hikes)
    res.status(200).json(hikes).end();
  } catch (error) {
    res.status(500).json(error).end();
  }
});

router.post('/User', [
  body('user.email').notEmpty().withMessage('Email cannot be empty!')
    .isEmail().withMessage('Incorrect email format!'),
  body('user.name').notEmpty().withMessage('Name cannot be empty!'),
  body('user.lastname').notEmpty().withMessage('Lastname cannot be empty!'),
  body('user.password').notEmpty().withMessage('Password cannot be empty!'),
  body('user.phoneNumber').notEmpty().withMessage('PhoneNumber cannot be empty!'),
  //.isNumeric().withMessage('PhoneNumber must be numeric!'),											//on db the phone numbers are in this format: +39 1234567890
  body('user.role').notEmpty().withMessage('Role cannot be empty!')
    .isIn(["Hiker", "LocalGuide", "HutWorker"]).withMessage('Incorrect format of role!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.addUser(req, res)
});

router.get('/request',c.getAllRequests);
router.delete('/request/:email',c.deleteReq);
router.get('/User/:email', [
  param('email').notEmpty().withMessage('Email cannot be empty!')
    .isEmail().withMessage('Incorrect email format!'),
], (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  next()
}, c.getUser);

router.get('/Code/:email', [
  param('email').notEmpty().withMessage('Email cannot be empty!')
    .isEmail().withMessage('Incorrect email format!'),
], (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  next()
}, c.checkCode);



router.post('/newHike', [
  body('newHike.title').notEmpty().withMessage('Title cannot be empty!'),
  body('newHike.length').notEmpty().withMessage('Length cannot be empty!')
    .isNumeric().withMessage('Length must be numeric!'),
  body('newHike.expected_time').notEmpty().withMessage('Expected time cannot be empty!')
    .isNumeric().withMessage('Expected time must be numeric!'),
  body('newHike.ascent').notEmpty().withMessage('Ascent cannot be empty!')
    .isNumeric().withMessage('Ascent must be numeric!'),
  body('newHike.difficulty').notEmpty().withMessage('Difficulty cannot be empty!')
    .isIn(["Tourist", "Hiker", "Professional hiker"]).withMessage('Incorrect format of diffiuclty!'),
  body('newHike.start_point').notEmpty().withMessage('Start point cannot be empty!')
    //.isNumeric().withMessage('Start point must be numeric!'),
  ,body('newHike.end_point').notEmpty().withMessage('End point cannot be empty!')
    //.isNumeric().withMessage('End point must be numeric!'),
  ,body('newHike.description').notEmpty().withMessage('Description cannot be empty!'),
  body('newHike.gpx_track').notEmpty().withMessage('Gpx track cannot be empty!'),
  body('newHike.picture').notEmpty().withMessage('Picture cannot be empty!'),
  //body('newHike.local_guide').notEmpty().withMessage('Local Guide cannot be empty!'),
  //body('newHike.hike_condition').notEmpty().withMessage('Hike condition cannot be empty!'),

], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.addHike(req, res)
});

router.put('/updateHike', [
  body('oldHikeTitle').notEmpty().withMessage('Old title cannot be empty!'),
  body('hike.title').notEmpty().withMessage('Title cannot be empty!'),
  body('hike.length').notEmpty().withMessage('Length cannot be empty!')
    .isNumeric().withMessage('Length must be numeric!'),
  body('hike.expected_time').notEmpty().withMessage('Expected time cannot be empty!')
    .isNumeric().withMessage('Expected time must be numeric!'),
  body('hike.ascent').notEmpty().withMessage('Ascent cannot be empty!')
    .isNumeric().withMessage('Ascent must be numeric!'),
  body('hike.difficulty').notEmpty().withMessage('Difficulty cannot be empty!')
    .isIn(["Tourist", "Hiker", "Professional hiker"]).withMessage('Incorrect format of diffiuclty!'),
  body('hike.description').notEmpty().withMessage('Description cannot be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.updateHike(req, res);
});

router.get('/getPoints', async (req, res) => {
  try {
    const points = await c.getPoints();
    res.status(200).json(points).end();
  } catch (e) {
    res.status(500).json(e).end();
  }
});

router.post('/Point', [
  body('point.address').notEmpty().withMessage('Address cannot be empty!'),
  body('point.gps_coordinates').notEmpty().withMessage('Gps coordinates cannot be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.addPoint(req, res)
});

router.get('/getHuts', async (req, res) => {
  try {
    const huts = await c.getHuts();
    res.status(200).json(huts).end();
  } catch (e) {
    res.status(500).json(e).end();
  }
});

router.post('/Huts', [
  body('hut.address').notEmpty().withMessage('Address cannot be empty!'),
  body('hut.gps_coordinates').notEmpty().withMessage('Gps coordinates cannot be empty!'),
  body('hut.phone').notEmpty().withMessage('Phone cannot be empty!'),
  body('hut.email').notEmpty().withMessage('Email cannot be empty!'),
  body('hut.description').notEmpty().withMessage('Description cannot be empty!'),
  body('hut.picture').notEmpty().withMessage('Picture cannot be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.addHut(req, res)
});

/*************HikerHike API************/

router.post('/startHike', [
  body('hiker_email').notEmpty().withMessage('The email of the hiker can not be empty!'),
  body('hike_title').notEmpty().withMessage('The title of the hike can not be empty!'),
  body('start_time').notEmpty().withMessage('The starting time can not be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.startHike(req, res)
});

router.put('/updateEndTime', [
  body('hiker_email').notEmpty().withMessage('The email of the hiker can not be empty!'),
  body('hike_title').notEmpty().withMessage('The title of the hike can not be empty!'),
  body('start_time').notEmpty().withMessage('The starting time can not be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.updateEndTime(req, res)
});

router.post('/endHikeFirstTime', [
  body('hiker_email').notEmpty().withMessage('The email of the hiker can not be empty!'),
  body('hike_title').notEmpty().withMessage('The title of the hike can not be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.endHike(req, res)
});

router.put('/endHike', [
  body('hiker_email').notEmpty().withMessage('The email of the hiker can not be empty!'),
  body('hike_title').notEmpty().withMessage('The title of the hike can not be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.updateEndHike(req, res)
});

router.get('/checkFirstTime', async (req, res) => {
  try {
    const flag = await c.checkFirstTime(req);
    res.status(200).json(flag).end();
  } catch (error) {
    res.status(500).json(error).end();
  }
});

router.get('/getOnGoingHike/:hiker', async (req, res) => {
  try {
    const hike = await c.getOnGoingHike(req);
    res.status(200).json(hike).end();
  } catch (error) {
    res.status(500).json(error).end();
  }
});

router.get('/getFinishedHikes', async (req, res) => {
  try {
    const hikes = await c.getFinishedHikes();
    res.status(200).json(hikes).end();
  } catch (error) {
    res.status(500).json(error).end();
  }
});

router.get('/getDistinctFinishedHikes', async (req, res) => {
  try {
    const hikes = await c.getDistinctFinishedHikes();
    res.status(200).json(hikes).end();
  } catch (error) {
    res.status(500).json(error).end();
  }
});

router.get('/getFinishedHikesByHiker/:hiker', async (req, res) => {
  try {
    const hikes = await c.getFinishedHikesByHiker(req);
    res.status(200).json(hikes).end();
  } catch (error) {
    res.status(500).json(error).end();
  }
});

module.exports = router