import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, InputGroup, Alert, Nav } from 'react-bootstrap';
import { GenericMap } from './hikePage';
import { HikesContainer } from './hikesCards';
import Profile from './profile';
import axiosInstance from "../utils/axios"
import "./sidebar.css";

const default_image= 'https://www.travelmanagers.com.au/wp-content/uploads/2012/08/AdobeStock_254529936_Railroad-to-Denali-National-Park-Alaska_750x500.jpg'


function LocalGuide_Home(props) {
  const [hikeForm, setHikeForm] = useState(false);
  const [parkingLotForm, setParkingLotForm] = useState(false);
  const [hutForm, setHutForm] = useState(false);
  const [seeHikes, setSeeHikes] = useState(false);
  const [profile, setProfile] = useState(true);

  function submitPicture(pict){
    let myBlob = new Blob([pict], { type: "text/plain" })
  
      const url = '/upload_pictures';
      const formData = new FormData();
  
      formData.append('file', myBlob,  pict.name);
      const config = {
        headers: {
          'content-type': "text/plain",
        },
      };
      axiosInstance.post(url, formData, config);
  }

  //handlers for the onClick events on buttons
  const selectProfile = () => {

    setHikeForm(false); setParkingLotForm(false); setHutForm(false); setSeeHikes(false); setProfile(true);

  };

  const selectHike = () => {
    setHikeForm(true); setParkingLotForm(false); setHutForm(false); setSeeHikes(false); setProfile(false);

  };

  const selectParking = () => {
    setParkingLotForm(true); setHikeForm(false); setHutForm(false); setSeeHikes(false); setProfile(false);

  };

  const selectHut = () => {
    setHutForm(true); setHikeForm(false); setParkingLotForm(false); setSeeHikes(false); setProfile(false);

  };

  const selectSeeHikes = () => {
    setSeeHikes(true); setHutForm(false); setHikeForm(false); setParkingLotForm(false); setProfile(false);

  };

  return (
    <Row>
      <Col xs={2}>
        <LocalGuide_Home_Sidebar setHikeForm={selectHike} setParkingForm={selectParking} setHutForm={selectHut} setSeeHikes={selectSeeHikes} setProfile={selectProfile} />
      </Col>
      <Col xs={10}>
        <div className='mx-3 my-3'>
          <div>{profile ? <Profile user={props.currentUser} /> : <></>}</div>
          <div>{hikeForm ? <HikeForm hikes={props.hikes} currentUser={props.currentUser} CreateNewPoint={props.CreateNewPoint} CreateNewHike={props.CreateNewHike} points={props.points} 
          setOnChangeHikes={props.setOnChangeHikes} setOnChangePoints={props.setOnChangePoints} submitPicture={submitPicture}/> : <></>}</div>
          <div>{parkingLotForm ? <ParkingLotForm CreateNewPoint={props.CreateNewPoint} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} setOnChangePoints={props.setOnChangePoints}/> : <></>}</div>
          <div>{hutForm ? <HutForm CreateNewHut={props.CreateNewHut} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} setOnChangePoints={props.setOnChangePoints} submitPicture={submitPicture}/> : <></>}</div>
          <div>{seeHikes ? <HikeList hikes={props.hikes} currentUser={props.currentUser} setCurrentHike={props.setCurrentHike} /> : <></>}</div>
        </div>
      </Col>
    </Row>
  )
}

function LocalGuide_Home_Sidebar(props) {
  return (
    <Nav className="col-md-12 d-none d-md-block sidebar">
      <div className="sidebar-sticky"></div>
      <Nav.Item>
        <Nav.Link onClick={() => props.setProfile()}>Profile</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => props.setHikeForm()}>Insert a new hike</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => props.setHutForm()}>Insert a new hut</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => props.setParkingForm()}>Insert a new parking lot</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => props.setSeeHikes()}>Your hikes</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}



/**HIKE FORM */

function HikeForm(props) {

  const [title, setTitle] = useState('')
  const [length, setLength] = useState('')
  const [expTime, setExpTime] = useState('')
  const [ascent, setAscent] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [description, setDescription] = useState('')

  const [startPoint, setStartPoint] = useState('')
  const [startPointGps, setStartPointGps] = useState('')
  const [endPoint, setEndPoint] = useState('')
  const [endPointGps, setEndPointGps] = useState('')
  let reference_points = []
  const [map, setMap] = useState('') //USED TO SAVE MAP STRING
  const [gpxPos, setGpxPos] = useState(null)
  const [picture, setPicture]= useState(null)
  const [seePic, setSeePic]= useState(false)
  const [errorMsg, setErrorMsg] = useState("");

  const changeTitle = (val) => { setTitle(val) }
  const changeLength = (val) => { setLength(val) }
  const changeExpTime = (val) => { setExpTime(val) }
  const changeAscent = (val) => { setAscent(val) }
  const changeDifficulty = (val) => { setDifficulty(val); }
  const changeDescription = (val) => { setDescription(val) }
  const changeStartP = (val) => { setStartPoint(val) }
  const changeEndP = (val) => { setEndPoint(val) }


  const submitFile = () => {
    let myBlob = new Blob(
      [map],
      { type: "text/plain" }
    )
    let formData = new FormData()

    formData.append("file", myBlob, title)

    axiosInstance.post("/upload_file", formData, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  const submitHikeForm = (event) => {
    event.preventDefault();
    let newHike = undefined;
    //Checks on needed fields
    const match = props.hikes.find(h => h.title == title);
    if(match !== null && props.hike != null){
      setErrorMsg("The title entered has already been used.");
      return;
    }
    if (map !== '') {
      const start = { address: startPoint, gps_coordinates: startPointGps }
       //try to use startId and endId instead of performing again the search
      const end = { address: endPoint, gps_coordinates: endPointGps }

      //check on user's role (?)
      newHike = {
        title: title, length: length, expected_time: expTime, ascent: ascent, difficulty: difficulty,
        start_point: start, end_point: end, reference_points: reference_points,
        description: description, gpx_track: title, picture: picture.name, hike_condition: 'Open', local_guide: props.currentUser.username
      }
      props.CreateNewHike(newHike)
      submitFile()
      props.submitPicture(picture)
      alert('New Hike correctly added!')
      props.setOnChangeHikes(true)
      props.setOnChangePoints(true)
      document.getElementById('hikeForm').hidden = true;
      reset()
    }
    else {
      setErrorMsg("Enter a valid gpx file.");
    }
  }

  const reset = () => {
    setTitle('');
    setLength(''); setExpTime(''); setAscent('')
    setDifficulty(''); setDescription('');
    setStartPoint(''); setStartPointGps('');
    setEndPoint(''); setEndPointGps('');
    setErrorMsg(''); setMap(''); 
    setGpxPos(null); setPicture(null); setSeePic(false)

  }

  //Import gpx file and read, gpx parse it is used to retreive the start point and the end point (format latitude,longitude)
  //after have red the file it changes automatically the start point and the end point 
  const importGpx = (selectedFile) => {
    const $ = require("jquery");
    let gpxParser = require('gpxparser');
    let gpx = new gpxParser()
    setTitle('');
    setLength(''); setExpTime(''); setAscent('')
    setDifficulty(''); setDescription('');
    setStartPoint(''); setStartPointGps('');
    setEndPoint(''); setEndPointGps('');
    setErrorMsg('');
    let reader = new FileReader();

    reader.readAsText(selectedFile);

    reader.onload = function () {
      gpx.parse(reader.result)

      const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon, p.ele]).filter((x) => x[2] != null)
      if (positions.length == 0) {
        setErrorMsg("No Elevation available")
        setGpxPos(null)
        setMap('')
      }
      else {

        //storing lat and lon inside the status of start/end point
        let gps_start = `${positions[0][0]}, ${positions[0][1]}`
        let gps_end = `${positions[positions.length - 1][0]}, ${positions[positions.length - 1][1]}`
        console.log('gps_start=' + gps_start + ', STATE startP= ' + startPointGps)
        console.log('gps_end= ' + gps_end + ', STATE endP= ' + endPointGps)

        let trackPoints = gpx.tracks[0].points.map((o) => o.ele).filter((x) => x != null)
//        console.log(trackPoints)
        if (trackPoints.length != 0) {
          let maxPoint = Math.max(...trackPoints)
          let minPoint = Math.min(...trackPoints)
          console.log(maxPoint)
          console.log(minPoint)
          let totalElevation = (Number(maxPoint - minPoint).toFixed(2));
          changeAscent(totalElevation);

        }

        let totalDistance = (Number(gpx.tracks[0].distance.total / 1000).toFixed(2));
        changeLength(totalDistance);
        console.log(positions[0]);
        console.log(positions[positions.length - 1]);
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[0][0] + '&lon=' + positions[0][1] + '&format=json&limit=1&q=', function (data) {
        });
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[positions.length - 1][0] + '&lon=' + positions[positions.length - 1][1] + '&format=json&limit=1&q=', function (data) {
        });

        setMap(reader.result)
        setGpxPos(positions)
      }
    };

    reader.onerror = function () {
      console.log(reader.error);
    };

  }

  const showPicture= (pict) =>{

    setPicture(pict);
    console.log(pict.name);

    let checkString= pict.name.split(".")
    if(checkString[1] !== "jpg" && checkString[1] !== "jpeg" && checkString[1] !== "png"){
      setErrorMsg("Not valid extension. Please insert a .jpg, .jpeg or .png file");
      setPicture(null);
    
    }else{ setSeePic(true) }
  }

  return (<>
    {errorMsg ? (<Alert variant="danger" onClose={() => { setErrorMsg(""); }} dismissible> {errorMsg}</Alert>) : (false)}

    <Form id='hikeForm' onSubmit={submitHikeForm} style={{ fontSize: 15, fontWeight: 'bold' }}>

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Title</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control value={title} required={true} onChange={(ev) => changeTitle(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Description</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control as="textarea" required={true} rows={3} value={description} onChange={(ev) => changeDescription(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Label style={{ fontSize: 25 }}>Hike's Details</Form.Label>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Length</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-map"></i></InputGroup.Text>
            <Form.Control disabled value={length} required={true} onChange={(ev) => changeLength(ev.target.value)} placeholder="3.2" />
            <InputGroup.Text>Km</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Expected Time</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-stopwatch"></i></InputGroup.Text>
            <Form.Control
              type="number"
              min="1" 
              value={expTime} required={true} onChange={(ev) => changeExpTime(ev.target.value)} placeholder="4" />
            <InputGroup.Text>hours</InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Ascent</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-geo-fill"></i></InputGroup.Text>
            <Form.Control disabled value={ascent} required={true} onChange={(ev) => changeAscent(ev.target.value)} placeholder="670" />
            <InputGroup.Text>m</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Difficulty</Form.Label>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-graph-up-arrow"></i></InputGroup.Text>
            <Form.Select required={true} value={difficulty} onChange={(ev) => changeDifficulty(ev.target.value)}>
              <option label=''></option>
              <option value='Tourist' label="Tourist" />
              <option value='Hiker' label="Hiker" />
              <option value='Professional hiker' label="Professional Hiker" />
            </Form.Select>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Start Point</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
            <Form.Control disabled value={startPoint} required={true} onChange={(ev) => changeStartP(ev.target.value)} />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>End Point</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
            <Form.Control disabled value={endPoint} required={true} onChange={(ev) => changeEndP(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      {/**GPX FILE */}
      <Form.Group className='mt-3'>
        {gpxPos != null ?
          <>
            <GenericMap gpxFile={map} currentHike={[]} currentMarkers={[]} setCurrentMarkers={''} points={[...props.points].filter((x) => x.type != null)}
              setStartPoint={setStartPoint} setStartPointGps={setStartPointGps} setEndPoint={setEndPoint} setEndPointGps={setEndPointGps} 
              endPoint={endPoint} startPoint={startPoint}/>
          </>
          : null}
      </Form.Group>

        {/* This is the form used to import the gpx, on upload of the file it call the importGpx function passing the file object */}
      <Form.Group controlId="formFile" className="mt-3">
        <Form.Label style={{ fontSize: 25 }}>Upload the GPX track</Form.Label>
        <Form.Control type="file" required={true} onChange={(e) => importGpx(e.target.files[0])} />
      </Form.Group>

      {/**COVER PICTURE */}
      <Form.Group controlId="pictureFile" className="mt-3">
        <Form.Label style={{ fontSize: 25 }}>Hike's Picture  {seePic ? <i class="bi bi-check-circle" color='success'></i> : <></> }</Form.Label>
        <Form.Control type="file" required onChange={(e) => showPicture(e.target.files[0])} />
      </Form.Group>


      {/**BUTTONS */}
      <div className='mt-y'>
      <Button type='submit' style={{ background: 'green' }}>Save</Button>
      <Button style={{ background: 'green' }} onClick={reset} className='ms-2 my-2'>Cancel</Button>
      </div>
    </Form>

  </>)
}


/**HUT FORM */

function HutForm(props) {

  const [title, setTitle] = useState('')
  const [position, setPosition] = useState('')
  const [altitude, setAltitude] = useState('')
  const [address, setAddress] = useState('')
  const [numBeds, setNumBeds] = useState(0)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [webSite, setWebSite] = useState('')
  const [description, setDescription] = useState('')
  const [picture, setPicture] = useState(null)
  const [seePic, setSeePic] = useState(false)
  const [clicked, setClicked] = useState(false)

  const showPicture= (pict) =>{
    setPicture(pict);

    let checkString= pict.name.split(".")
    if(checkString[1] !== "jpg" && checkString[1] !== "jpeg" && checkString[1] !== "png"){
//      setErrorMsg("Not valid extension. Please insert a .jpg, .jpeg or .png file");
      setPicture(null);
    
    }else{ setSeePic(true) }
  }

  const resetState = () => {
    setTitle('')
    setPosition(''); setAltitude('');
    setAddress(''); setNumBeds(0);
    setPhone(''); setEmail('');
    setWebSite(''); setDescription('');
    setClicked(false); setPicture(null); setSeePic(false);
  }

  useEffect(() => {
    props.setCurrentMarkers([]);
  }, [])
  useEffect(() => {
    if (props.currentMarkers.length != 0) {
      setPosition(props.currentMarkers[0].latlng.lat + "," + props.currentMarkers[0].latlng.lng)
      setAddress(props.currentMarkers[0].address)
      setTitle(props.currentMarkers[0].address.split(',')[0])
      setClicked(true)
    }
    else {
      resetState()
    }
  }, [props.currentMarkers]);

  const submitHutForm = (event) => {
    event.preventDefault();
    let newHut;

    newHut = {
      address: address, nameLocation: title, gps_coordinates: position, type: 'Hut', capacity: numBeds, altitude: altitude,
      phone: phone, email: email, web_site: webSite, description: description, picture: picture.name
    }
    console.log(newHut)
    //call to the API
    props.CreateNewHut(newHut)
    props.submitPicture(picture)
    props.setOnChangePoints(true)
    alert('New Hut correctly added!')
  }


  return (<>
    {/*errorMsg ? (<Alert variant="danger" onClose={() => { setErrorMsg(""); }} dismissible> {errorMsg}</Alert>) : (false)*/}

    <Form id='hutForm' onSubmit={submitHutForm} style={{ fontSize: 15, fontWeight: 'bold' }}>

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Title</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control value={title} required={true} onChange={(ev) => setTitle(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Label style={{ fontSize: 25 }}>Geographical Information</Form.Label>
      </Row>

      <Row>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-signpost"></i></InputGroup.Text>
            <Form.Control value={address} required={true} disabled={clicked} onChange={(ev) => setAddress(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Position</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-geo-alt"></i></InputGroup.Text>
            <Form.Control value={position} required={true} disabled={clicked} onChange={(ev) => setPosition(ev.target.value)} />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Altitude</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-geo-fill"></i></InputGroup.Text>
            <Form.Control value={altitude} required={true} onChange={(ev) => setAltitude(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Label style={{ fontSize: 25 }}>Contacts</Form.Label>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Phone</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-telephone"></i></InputGroup.Text>
            <Form.Control value={phone} required={true} onChange={(ev) => setPhone(ev.target.value)} />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Email</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-envelope"></i></InputGroup.Text>
            <Form.Control value={email} required={true} onChange={(ev) => setEmail(ev.target.value)} />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Web Site</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-mouse"></i></InputGroup.Text>
            <Form.Control value={webSite} onChange={(ev) => setWebSite(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Label style={{ fontSize: 25 }}>Description</Form.Label>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Number of beds</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text> <i className="bi bi-person-plus"></i></InputGroup.Text>
            <Form.Control value={numBeds} required={true} type='number' min='0' onChange={(ev) => setNumBeds(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} required={true} onChange={(ev) => setDescription(ev.target.value)} />
        </Form.Group>
      </Row>
      {/**COVER PICTURE */}
      <Form.Group controlId="pictureFile" className="mt-3">
        <Form.Label>Hut's Picture  {seePic ? <i class="bi bi-check-circle" color='success'></i> : <></> }</Form.Label>
        <Form.Control type="file" required onChange={(e) => showPicture(e.target.files[0])} />
      </Form.Group>

      <div>
        <Button className='mt-y' type='submit' style={{ background: 'red' }}>Save</Button>
        <Button style={{ background: 'red' }} onClick={resetState} className='ms-2 my-2'>Cancel</Button>
      </div>
    </Form>

    <GenericMap gpxFile={''} currentHike={[]} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} clicked={clicked} generic={true} />
  </>)
}


/**PARKING FORM */

function ParkingLotForm(props) {

  const [title, setTitle] = useState('')
  const [position, setPosition] = useState('')
  const [address, setAddress] = useState('')
  const [capacity, setCapacity] = useState(0)
  const [clicked, setClicked] = useState(false)

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => { props.setCurrentMarkers([]); }, [])

  useEffect(() => {
    if (props.currentMarkers.length != 0) {
      setPosition(props.currentMarkers[0].latlng.lat + "," + props.currentMarkers[0].latlng.lng)
      setAddress(props.currentMarkers[0].address)
      setTitle(props.currentMarkers[0].address.split(',')[0])
      setClicked(true)
    }
    else {
      reset()
    }
  }, [props.currentMarkers]);

  const reset = () => {
    setPosition('')
    setAddress('')
    setCapacity(0)
    setClicked(false)
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    // validation
    let newPoint;
    newPoint = { nameLocation: title, address: address, gps_coordinates: position, type: 'Parking Lot', capacity: capacity };

    props.CreateNewPoint(newPoint);
    props.setOnChangePoints(true);
    alert('New parking lot added.');
    console.log(newPoint);
  }


  return (<>
    {errorMsg ? (<Alert variant="danger" onClose={() => setErrorMsg("")} dismissible> {errorMsg} </Alert>) : (false)}

    <Form onSubmit={handleSubmit} style={{ fontSize: 15, fontWeight: 'bold' }} >

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Title</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control value={title} required={true} onChange={(ev) => setTitle(ev.target.value)} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Label style={{ fontSize: 25 }}>Informations</Form.Label>
      </Row>

      <Row>
        <Form.Group>
          <Form.Label>Position</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-geo-alt"></i></InputGroup.Text>
            <Form.Control value={position} required={true} disabled={clicked} onChange={(ev) => setPosition(ev.target.value)}></Form.Control>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-signpost"></i></InputGroup.Text>
            <Form.Control value={address} required={true} disabled={clicked} onChange={(ev) => setAddress(ev.target.value)}></Form.Control>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group>
          <Form.Label>Capacity</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-car-front"></i></InputGroup.Text>
            <Form.Control value={capacity} required={true} type='number' min='0' onChange={(ev) => setCapacity(ev.target.value)}></Form.Control>
          </InputGroup>
        </Form.Group>
      </Row>

      <Button className='mt-y' type='submit'>Save</Button>
      <Button onClick={() => { reset() }} className='ms-2 my-2'>Cancel</Button>

    </Form>
    <GenericMap gpxFile={''} currentHike={[]} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} clicked={clicked} generic={true} />

  </>)
}

function HikeList(props) {

  function calculateMyHikes(hikes, email) {
    const result = [];
    for (const h of hikes) {
      if (h.local_guide == email) {
        result.push(h);
      }
    }
    return result;
  };

  const [myHikes, setMyHikes] = useState([]);

  useEffect(() => {
    setMyHikes(calculateMyHikes(props.hikes, props.currentUser.username));
  }, []);

  return (
    <>
      <HikesContainer role={props.currentUser.role} hikes={myHikes} setCurrentHike={props.setCurrentHike} />
    </>
  )
}

export { LocalGuide_Home }