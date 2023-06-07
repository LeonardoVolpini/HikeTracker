const dao = require('./DAO');
const crypto = require('crypto');
const { start } = require('repl');

exports.getHikes = async function () {
  try {
    let fullHikes = []
    let hikes = await dao.readHikes();
    for (let hike of hikes) {
      hike['reference_points'] = await dao.readListOfReferencePoints(hike.title);
      hike['linkedHuts'] = await dao.getHutsLinkedByTitle(hike.title)
      fullHikes.push(hike)
    }
    return fullHikes;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

exports.addHike = async function (req, res) {

  //better rename these two fields in start_point_address and end_point_address because they are address, not idPoint
  let startId = await dao.checkPresenceByCoordinates(req.body.newHike.start_point.gps_coordinates)
  let endId = await dao.checkPresenceByCoordinates(req.body.newHike.end_point.gps_coordinates)

  if(req.body.newHike.start_point.gps_coordinates == req.body.newHike.end_point.gps_coordinates && startId == null && endId == null ){
    startId = endId = { idPoint: await dao.addPoint(req.body.newHike.start_point)}
  }
  else{
    if (startId == null)
      startId = { idPoint: await dao.addPoint(req.body.newHike.start_point)}
    if(endId == null) {
      endId = {idPoint: await dao.addPoint(req.body.newHike.end_point)}
    }
  }


  let hike = {
    title: req.body.newHike.title, length: req.body.newHike.length, expected_time: req.body.newHike.expected_time,
    ascent: req.body.newHike.ascent, difficulty: req.body.newHike.difficulty, start_point: startId.idPoint, end_point: endId.idPoint,
    reference_points: req.body.newHike.reference_points, description: req.body.newHike.description, gpx_track: req.body.newHike.gpx_track,
    picture: req.body.newHike.picture, hike_condition: req.body.newHike.hike_condition, local_guide: req.body.newHike.local_guide
  }
  dao.addHike(hike).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.updateHike = async function (req, res) {

  const oldHike = await dao.getHikeByTitle(req.body.oldHikeTitle);
  //Temporary solution used to check gps coordinates with or without space after the comma. Gps coordinates should be added in a single way 
  let startId = await dao.checkPresenceByCoordinates(req.body.hike.start_point.gps_coordinates)
  startId = startId != undefined ? startId : await dao.checkPresenceByCoordinates(req.body.hike.start_point.gps_coordinates.replace(',',', '))
  let endId = await dao.checkPresenceByCoordinates(req.body.hike.end_point.gps_coordinates)
  endId = endId != undefined ? endId : await dao.checkPresenceByCoordinates(req.body.hike.end_point.gps_coordinates.replace(',',', '))
    //console.log(startId.idPoint, endId.idPoint)
  
  const updateHike = {
    title: req.body.hike.title, length: req.body.hike.length, expected_time: req.body.hike.expected_time,
    ascent: req.body.hike.ascent, difficulty: req.body.hike.difficulty, start_point: startId.idPoint, end_point: endId.idPoint,
    reference_points: req.body.hike.reference_points, description: req.body.hike.description, linkedHuts:req.body.hike.linkedHuts,  gpx_track: oldHike.gpx_track,
    hike_condition: req.body.hike.hike_condition, hike_condition_description: req.body.hike.hike_condition_description, local_guide: oldHike.local_guide
  }

  function deletePointsInPTables(oldRP){
    console.log('Points to delete: '+`${oldRP}`)
    console.log(oldRP)
    if(oldRP.length != 0){
      dao.getHikePoint().then(
        result=>{
          let otherP = result.map(x =>{return x.idPoint})
          oldRP.filter(j =>{return !otherP.includes(j)})
          oldRP.forEach(element => {
            dao.deletePoint(element).then(
              result=>{
                return res.status(200)
              },
              error=>{
                return res.status(500).send(error)
              }
            )
          });
        },
        error =>{
          return res.status(500).send(error)
        }
      )
    }
  }

  function addNewPoint(newPoint){
    dao.addPoint(newPoint).then(
      result => {
        console.log('New Point: '+`${result}`)
        dao.addHikePoint(result, updateHike.title,newPoint.nameLocation).then(
          result => {
            return res.status(200);
          },
          error => {
            console.log("Error on addHikePoint in result with new point "+`${error}`)
            return res.status(500).send(error);
          }
        )
      },
      error => {
        console.log("Error on addPoint with new point "+`${error}`)
        return res.status(500).send(error);
      }
    )

  }
  function addOldPoint(oldRP, oldPoint, nameLocation){
    if(Object.values(oldRP).includes(oldPoint)){
      oldRP.splice(oldRP.indexOf(oldPoint),1)
    }
    console.log('Old Point: '+`${oldPoint}`)
    dao.addHikePoint(oldPoint, updateHike.title, nameLocation).then(
      result => {
        return res.status(200);
      },
      error => {
        console.log("Error on addHikePoint with point available "+`${error}`)
        return res.status(500).send(error);
      }
    )
  }

  dao.updateHike(req.body.oldHikeTitle, updateHike).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
  if(req.body.oldHikeTitle !== updateHike.title){
    dao.updateHikerHikeStatistics_Hike(req.body.oldHikeTitle,updateHike.title).then(
      result => {
        return res.status(200).json();
      },
      error => {
        return res.status(500).send(error);
      }
    )
    dao.updateHikerHike_Hike(req.body.oldHikeTitle,updateHike.title).then(
      result => {
        return res.status(200).json();
      },
      error => {
        return res.status(500).send(error);
      }
    )
  }

  
  /*
    This next part is to add or delete, if needed, the relationships
    between a hike and a point. Delete everything and add new.
  */
  // Delete
  dao.getHikePointByTitle(oldHike.title).then(
    result => {

        let oldRP = result.map(x =>x.idPoint)

        dao.deleteHikePoint_Hike(oldHike.title).then(
          result => {
            if(updateHike.reference_points.length == 0){
              deletePointsInPTables(oldRP)
            }
            else{
              updateHike.reference_points.map((rp, index) =>{
                let newPoint = {nameLocation: rp.nameLocation, altitude: rp.altitude, address: rp.address, gps_coordinates: rp.latlng.lat+","+rp.latlng.lng}
                dao.checkPresenceByCoordinates(newPoint.gps_coordinates).then(
                  result =>{
                    if(result == null){
                      addNewPoint(newPoint)
                    }
                    else{
                      addOldPoint(oldRP, result.idPoint,newPoint.nameLocation)
                    }
                    if(updateHike.reference_points.length-1 == index){
                      deletePointsInPTables(oldRP)
                    }
                  },
                  error =>{
                    console.log(error);
                    return res.status(500).send(error)
                  }
                )
      
              })
            }
            return res.status(200).json();
          },
          error => {
            console.log("Error on deleteHikePoint"+`${error}`)
            return res.status(500).send(error);
          }
        )
    }
  )

    dao.deleteLinkedHut_byTitle(oldHike.title).then(
      result=>{
        if(updateHike.linkedHuts.length != 0){
          dao.readHuts().then(
            result=>{
              let huts = result.map(h =>{return {idPoint: h.idPoint, idHut: h.idHut}})
              updateHike.linkedHuts.map(lh=>{
                dao.checkPresenceByCoordinates(lh.gps_coordinates).then(
                  result=>{
                    let hut = huts.find(x=>{return x.idPoint == result.idPoint})
                    dao.addLinkedHut(hut.idHut,updateHike.title).then(
                      result=>{
                        return res.status(200)
                      },
                      error =>{
                        console.log("Error on addLinkedHut: "+ `${error}`)
                        return res.status(500).send(error)
                      }
                    )
                  },
                  error=>{
                    console.log("Error on checkPresenceByCoordinates of updateHike/LinkHut: "+ `${error}`)
                    return res.status(500).send(error)
                  }
                )
              }) 
            },
            error =>{
              console.log("Error on readHuts of updateHike/LinkHut: "+ `${error}`)
              return res.status(500).send(error)
            }
          )
        }
      },
      error=>{
        console.log("Error on deleteLinkedHut_byTitle: "+ `${error}`)
        return res.status(500).send(error)
      }
    )
}

exports.getHuts = async function () {
  try {
    const huts = await dao.readHuts();
    return huts;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function RandomIndex(min, max, i, _charStr) {

  let index = Math.floor(crypto.randomBytes(1).readUInt8(0) * (max - min + 1) + min),
    numStart = _charStr.length - 10;
  if (i == 0 && index >= numStart) {
    index = RandomIndex(min, max, i, _charStr);
  }
  return index;
}


exports.addUser = async function (req, res) {
  const u = await dao.getUserByEmail(req.body.user.email);
  if (!u.error) { res.status(422).send("This email has been registered.").end(); }
  else {
    const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
    let min = 0, max = _charStr.length - 1, salt = '';
    let len = 32;
    for (let i = 0, index; i < len; i++) {
      index = RandomIndex(min, max, i, _charStr);
      salt += _charStr[index];
    }

    crypto.scrypt(req.body.user.password, salt, 32, function (err, value) {
      if (err) reject(err);
      else {
        dao.addUser(req.body.user.email, value, req.body.user.role, req.body.user.name, req.body.user.lastname, req.body.user.phoneNumber, salt).then(
          result => {
            dao.deleteCode(req.body.user.email).then(
              result => {
                return res.status(200).json();
              },
              error => {
                return res.status(500).send(error);
              }
            );
          },
          error => {
            return res.status(500).send(error);
          }
        )
      }
    });
  }
}

exports.checkCode = async function (req, res) {
  dao.getCode(req.params.email).then(
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.getAllRequests = function(req,res)  {
  dao.getAllRequests().then(
      result => {
           return res.status(200).json(result);                       
      },
      error => {
          return res.status(500).send(error);
      }
  )

}

exports.deleteReq = function(req,res)  {
  dao.deleteCode(req.params.email).then(
      result => {
           return res.status(200).json(result);                       
      },
      error => {
          return res.status(500).send(error);
      }
  )

}

exports.getUser = async function (req, res) {
  dao.getUserByEmail(req.params.email).then(
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.getPoints = async function () {
  try {
    const points = await dao.readPoints();
    return points;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

//It checks for the presence of the point in the db, then:
//-if not present, it is added;
//-if present, a positive feedback is sent anyway   
exports.addPoint = async function (req, res) {
  try {
    const id = await dao.checkPresenceByCoordinates(req.body.point.gps_coordinates)
    if (id !== null) {
      return res.status(200).json(id);
    } else {
      dao.addPoint(req.body.point).then(
        result => {
          return res.status(200).json(result);
        },
        error => {
          return res.status(500).send(error);
        }
      )
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

//It checks for the presence of the point in the db, then:
//-if not present, it is added;
//-if present, a positive feedback is sent anyway   
exports.addHut = async function (req, res) {

  //console.log("Inside addHut server side")
  // console.log(req.body.hut)
  try {
    const id = await dao.checkPresenceByCoordinates(req.body.hut.address)
    if (id !== null) {
      return res.status(200).json(id);
    }

    const res1 = dao.addHut(req.body.hut).then(
      result => {

        dao.addPoint(req.body.hut).then(
          result => {
            return res.status(200).json(result);
          },
          error => {
            return res.status(500).send(error);
          }
        )
      },
      error => {
        return res.status(500).send(error);
      }

    )

  } catch (e) {
    console.log(e);
    throw e;
  }
}

/*************HikerHike API************/

exports.startHike = async function (req, res) {
  const ongoing = await dao.getOnGoingHike(req.body.hiker_email);
    if (ongoing.length!==0) {
      return res.status(422).send("There is already an ongoing hike.").end();
    }
  dao.startHike(req.body.hiker_email, req.body.hike_title, req.body.start_time).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.updateEndTime = async function (req, res) {
  dao.updateHikeEndTime(req.body.hiker_email, req.body.hike_title, req.body.start_time, req.body.end_time).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.endHike = async function (req, res) {
  dao.endHike(req.body.hiker_email, req.body.hike_title, req.body.duration).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.updateEndHike = async function (req, res) {
  const actualBestTime = await dao.getBestTime(req.body.hiker_email, req.body.hike_title);
  console.log(actualBestTime)
  console.log(req.body.duration)
  if (req.body.duration < actualBestTime.best_time) {
    dao.updateEndHikeBestTime(req.body.hiker_email, req.body.hike_title, req.body.duration).then(
      result => {
        return res.status(200).json();
      },
      error => {
        return res.status(500).send(error);
      }
    )
  } 
  else {
    dao.updateEndHikeNoBestTime(req.body.hiker_email, req.body.hike_title).then(
      result => {
        return res.status(200).json();
      },
      error => {
        return res.status(500).send(error);
      }
    )
  }
}

exports.checkFirstTime = async function (req) {
  try {
    const flag = await dao.checkFirstEnd(req.query.hiker, req.query.hike);
    return flag;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

exports.getOnGoingHike = async function (req) {
  try {
    const ongoing = await dao.getOnGoingHike(req.params.hiker);
    let result = [];
    if (ongoing.length!==0) {
      const h = await dao.getHikeByTitle(ongoing[0].hike);
      const startPoint = (await dao.readPointById(h.start_point))
      const endPoint = (await dao.readPointById(h.end_point))
      h['start_point_address'] = startPoint.address;
      h['end_point_address'] = endPoint.address;
      h['start_point_nameLocation'] = startPoint.nameLocation;
      h['end_point_nameLocation'] = endPoint.nameLocation;
      const hike = {hike: h, start_time: ongoing[0].start_time};
      result.push(hike);
    }
    return result;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

exports.getFinishedHikes = async function () {
  try {
    const hikes = await dao.getFinishedHikes();
    return hikes;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

exports.getDistinctFinishedHikes = async function () {
  try {
    const hikes = await dao.getDistinctFinishedHikes();
    return hikes;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

exports.getFinishedHikesByHiker = async function (req) {
  try {
    const titles = await dao.getFinishedHikesByHiker(req.params.hiker);
    let hikes = [];
    for(let t of titles) {
      const h = await dao.getHikeByTitle(t.hike);
      const startPoint = (await dao.readPointById(h.start_point))
      const endPoint = (await dao.readPointById(h.end_point))
      h['start_point_address'] = startPoint.address;
      h['end_point_address'] = endPoint.address;
      h['start_point_nameLocation'] = startPoint.nameLocation;
      h['end_point_nameLocation'] = endPoint.nameLocation;
      const hike = {hike: h, times_completed: t.times_completed, best_time: t.best_time};
      //console.log(hike)
      hikes.push(hike);
    }
    console.log(hikes)
    return hikes;
  } catch (error) {
    console.error(error)
    throw error;
  }
}