import { Card, Button, Row, ListGroup, Col, Container, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { React, useRef, useEffect, useState  } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Badge from 'react-bootstrap/Badge';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DateTimePicker from 'react-datetime-picker';
const default_image = 'https://www.travelmanagers.com.au/wp-content/uploads/2012/08/AdobeStock_254529936_Railroad-to-Denali-National-Park-Alaska_750x500.jpg'
const URL = 'http://localhost:3001/api/Pictures';

function HikeCard2(props) {
  const navigate = useNavigate()
  const [colorDiff, setColorDiff] = useState('success');
  const [nameStart, setNameStart] = useState('');
  const [nameEnd, setNameEnd] = useState('');
  const [picName, setPicName]= useState('');
  const [dateEnd, setDateEnd] = useState(new Date())
  const [showDetails, setShowDetails]= useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  function startHike() {
    let start_time = new Date();
    props.startHike(props.currentUser.username, props.hike.title, start_time.toISOString());
    props.setCurrentHike([props.hike]);
  }
  function handleError(err) {

    toast.error(
      err.error,
      { position: "top-center" },
      { toastId: 12 }
    );

  }

  function endHike(event) {
    event.preventDefault()
    console.log(dateEnd)
    let end_time = new Date();
    if(dateEnd - new Date() >= 0){
      if(dateEnd.toISOString() !== end_time.toISOString())
        props.endHike(props.currentUser.username, props.hike.title, props.hike.start_time, dateEnd.toISOString());
      else
        props.endHike(props.currentUser.username, props.hike.title, props.hike.start_time, end_time.toISOString());
      navigate('/')
    }
    else{
      handleError({error:'End time cannot be before the start time'})
    }

  }

  useEffect(() => {
    setColorDifficulty(props.hike.difficulty)
  }, [props.hike.difficulty])


  useEffect(() => {

    if (props.hike.start_point_nameLocation !== null) {
      setNameStart(props.hike.start_point_nameLocation)
    } else {
      let split_start = props.hike.start_point_address.split(",");
      setNameStart(split_start[0] + " , " + split_start[1])
    }

    if (props.hike.end_point_nameLocation !== null) {
      setNameEnd(props.hike.end_point_nameLocation)
    } else {
      let split_end = props.hike.end_point_address.split(",");
      setNameEnd((split_end[0] + " , " + split_end[1]));
    }

    let name= URL + "/" + props.hike.picture
    setPicName(name)

    console.log('hike=')
    console.log(props.hike)
    console.log(showDetails)

  }, [props.hike])

  const setColorDifficulty = (difficulty) => {
    if (difficulty === 'Tourist') {
      setColorDiff('success')
    } else if (difficulty === 'Hiker') {
      setColorDiff('warning')
    } else if (difficulty === 'Professional hiker') {
      setColorDiff('danger')
    }
  }

  return ( <>
    {errorMsg ? (<Alert variant="danger" onClose={() => { setErrorMsg(""); }} dismissible> {errorMsg}</Alert>) : (false)}
    <Card className="mx-1 my-1" border='success' style={{ width: '18rem' }}>
      <Card.Img variant="top" src={picName} />
      <Card.Body>

        <Card.Title style={{ fontWeight: 'bold', color: 'green' }}> {props.hike.title}</Card.Title>
        <ListGroup className="list-group-flush" style={{ fontWeight: 'bold', fontSize: 13 }}>
          <ListGroup.Item>
            <Row style={{fontSize: 16}}>
              <Col><Badge bg={colorDiff}> <i className="bi bi-graph-up-arrow"></i> {props.hike.difficulty}</Badge></Col>
              <Col><Badge bg='info'>{props.hike.hike_condition}</Badge></Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row >
              <Col><i className="bi bi-map"></i> {props.hike.length} km</Col>
              <Col><i className="bi bi-stopwatch"></i> {props.hike.expected_time} h</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <i className="bi bi-compass"></i> Start Point :
            { !showDetails ? <div style={{ fontWeight: 'normal' }}> {nameStart} </div> : <div style={{ fontWeight: 'normal' }}> {props.hike.start_point_address} </div>}
          </ListGroup.Item>
          <ListGroup.Item>
            <i className="bi bi-compass"></i> End Point :
            { !showDetails ? <div style={{ fontWeight: 'normal' }}>{nameEnd}</div> : <div style={{ fontWeight: 'normal' }}> {props.hike.end_point_address} </div>}
          </ListGroup.Item>
          {showDetails ? 
            <>
              <ListGroup.Item>
                <div><i class="bi bi-geo-fill"></i> {props.hike.ascent} m</div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div> Description : </div>
                <div style={{ fontWeight: 'normal' }}>{props.hike.description}</div>
              </ListGroup.Item> 
            </>
            
          : null}
          <ListGroup.Item>
            {props.role == 'Hiker' ? <Card.Link><Link to='/Map' style={{ fontWeight: 'normal', fontSize: 16 }} onClick={() => { props.setCurrentHike([props.hike]) }}>See on map</Link></Card.Link> : null}
          </ListGroup.Item>
            {props.role == 'Hiker' && props.flagCompleted ?
              <ListGroup.Item>
                <Row>
                  <Col>Times completed: </Col>
                  <Col style={{ fontWeight: 'normal' }}> {props.hike.times_completed} </Col>
                </Row>
              </ListGroup.Item>
              : null
            }
            {props.role == 'Hiker' && props.flagCompleted ?
              <ListGroup.Item>
                <Row>
                  <Col>Best time: </Col>
                  <Col style={{ fontWeight: 'normal' }}>{props.hike.best_time >= 60*24 ? Math.floor(props.hike.best_time/(60*24))+' d ' : '' }
                                                        {props.hike.best_time/(60*24) >= 1 ?  Math.floor(props.hike.best_time%(24*60))+' h ' : Math.floor(props.hike.best_time/(60)) > 0 ? Math.floor(props.hike.best_time/(60)) +' h ' : '' }
                                                        {props.hike.best_time >= 60 ? props.hike.best_time%60 : props.hike.best_time } min</Col>
                </Row>
              </ListGroup.Item>
              : null
            }
        </ListGroup>
        {props.role == 'Hiker' && props.flag ? 
          <Form  className="d-flex justify-content-center flex-wrap" onSubmit={endHike}>
            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                  <Form.Label></Form.Label>
                  <DateTimePicker minDate={new Date()} onChange={(e) => {setDateEnd(e); console.log(e)}} value={dateEnd} />
            </Form.Group>
            <Button className="btn btn-danger" type='submit'>End hike</Button>
          </Form>
          : null}
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col><Button variant='outline-success' onClick={() => {setShowDetails(!showDetails)}}>Details</Button></Col>
          <Col>
            {props.role == 'LocalGuide' ? <Link to='/editHike'><Button variant='outline-success' onClick={() => { props.setCurrentHike(props.hike) }}>Edit hike</Button></Link> : null}
            {props.role == 'Hiker' && !props.flagOnGoingHike ? <Link to='/profile'><Button variant='outline-success' onClick={() => { startHike() }}>Start hike</Button></Link> : null}
            {/*flag is a costant for choose to see or not the Start Button in the hikeCard. If it is true -> we are in onGoingHike page -> no show Start button but show eventually the End button*/}
            {/*flagOnGoingHike is a costant for choose to see or not the Start Button in the hikeCard. If it is true -> there is an hike in progress for the currentUser -> no show Start button*/}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
    </>
  );

}

function HikesContainer(props) {
  const actualIdx = useRef(0)
  const PAGE_SIZE = 8;
  const [hikes, setHikes] = useState([]);
  const index = useRef(PAGE_SIZE)
  const isLoading = useRef(true)
  useEffect(() => {
    setHikes(props.hikes.length != 0 ? props.hikes.slice(0, PAGE_SIZE > props.hikes.length ? props.hikes.length : PAGE_SIZE) : [])
    isLoading.current = false
  }, [props.hikes])
  const nextPage = () => {

    actualIdx.current = index.current == props.hikes.length ? actualIdx.current : index.current
    index.current = index.current + PAGE_SIZE > props.hikes.length ? props.hikes.length : index.current + PAGE_SIZE
    setHikes(props.hikes.slice(actualIdx.current, index.current))

  }
  const prevPage = () => {
    index.current = actualIdx.current == 0 ? index.current : actualIdx.current
    actualIdx.current = actualIdx.current - PAGE_SIZE > 0 ? actualIdx.current - PAGE_SIZE : 0
    setHikes(props.hikes.slice(actualIdx.current, index.current))
  }
 
  return (
    <>
      {hikes.length == 0 && !props.filter ? <>{!props.flagOnGoingHike ? <h1>There aren't on going hikes.</h1> : <ClipLoader color={'#fff'} size={150} />}</> :
        <>
          {/**From grid example, to better separate cards:     <Row xs={1} md={2} className="g-4"> */}
          <div className="d-flex justify-content-start flex-wrap">
            {hikes.length != 0 ? hikes.map((hike) => { return (<HikeCard2 role={props.role} key={hike.title} hike={hike} setCurrentHike={props.setCurrentHike} startHike={props.startHike} endHike={props.endHike} currentUser={props.currentUser} flag={props.flag} flagOnGoingHike={props.flagOnGoingHike} flagCompleted={props.flagCompleted} />) }) : <h3>No result found</h3>}
          </div>
          {<Container className="d-flex justify-content-center mt-2">
            <Row >
              <Col>
                {actualIdx.current != 0 && hikes.length != 0 ? <Button className="me-2" onClick={() => prevPage()}>Previous Page</Button> : null}
                {index.current < props.hikes.length && hikes.length != 0 ? <Button onClick={() => nextPage()}>Next Page</Button> : null}
              </Col>
            </Row>
          </Container>
          }
        </>}
    </>

  );
}

export { HikesContainer };