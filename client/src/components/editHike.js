import { React, useState } from 'react';
import { Row, Col, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GenericMap } from './hikePage';

function EditHike(props) {

  return (
    <>
      <Row>
        <EditHikeForm updateHike={props.updateHike} oldHike={props.currentHike} setCurrentMarkers={props.setCurrentMarkers} 
        currentMarkers={props.currentMarkers} returnToHome={props.returnToHome} points = {props.points} setOnChangeHikes={props.setOnChangeHikes}></EditHikeForm>
      </Row>
      <div className="d-flex flex-row">

      </div>
    </>
  )
}

function EditHikeForm(props) {

  const navigate = useNavigate();

  const [title, setTitle] = useState(props.oldHike.title)
  const [length, setLength] = useState(props.oldHike.length)
  const [expTime, setExpTime] = useState(props.oldHike.expected_time)
  const [ascent, setAscent] = useState(props.oldHike.ascent)
  const [difficulty, setDifficulty] = useState(props.oldHike.difficulty)
  const [description, setDescription] = useState(props.oldHike.description)
  const [condition, setCondition] = useState(props.oldHike.hike_condition ? props.oldHike.hike_condition : '')
  const [conditionDescription, setConditionDescription] = useState(props.oldHike.hike_condition_description ? props.oldHike.hike_condition_description : '')
  const [reference_points, setReferencePoints] = useState(props.oldHike.reference_points);
  const [errorMsg, setErrorMsg] = useState("");
  const [startPoint, setStartPoint] = useState(props.oldHike.start_point_address)
  const [startPointGps, setStartPointGps] = useState(props.oldHike.start_point_coordinates)
  const [endPoint, setEndPoint] = useState(props.oldHike.end_point_address)
  const [endPointGps, setEndPointGps] = useState(props.oldHike.end_point_coordinates)
  const [linkedHuts, setLinkedHuts] = useState(props.oldHike.linkedHuts? props.oldHike.linkedHuts : [])  
  function changeTitle (event){ 
    setTitle(event.target.value) 
  }
  function changeLength (event) { 
    setLength(event.target.value) 
  }
  function changeExpTime(event){ 
    setExpTime(event.target.value) 
  }
  function changeAscent(event){ 
    setAscent(event.target.value) 
  }
  function changeDifficulty(event){ 
    setDifficulty(event.target.value) 
  }
  function changeDescription (event){ 
    setDescription(event.target.value) 
  }
  function changeCondition(event){ 
    setCondition(event.target.value) 
  }
  function changeConditionDescription(event){ 
    setConditionDescription(event.target.value) 
  }
  const changeReferencePoints = (val) => { setReferencePoints(val) }

  const submitHikeForm = (event) => {
    event.preventDefault();
    let updateHike;
    //Checks on needed fields
    if (title !== "") {
      if (length !== "" && difficulty !== "") {
        if (description !== "") {
          
          updateHike = {
            title: title, length: length, expected_time: expTime, ascent: ascent,
            difficulty: difficulty, start_point: {address: startPoint, gps_coordinates: startPointGps}, end_point: {address: endPoint, gps_coordinates: endPointGps}, 
            reference_points: reference_points, linkedHuts: linkedHuts, description: description, hike_condition: condition,
            hike_condition_description: conditionDescription
          }
          console.log(updateHike)
          props.updateHike(props.oldHike.title, updateHike);
          alert('Hike correctly updated!')
          props.setOnChangeHikes(true)
          reset();
          navigate('/');
        } else {
          setErrorMsg("Enter a description before submit.");
        }
      } else {
        setErrorMsg("A length and a difficulty are required.")
      }
    } else {
      setErrorMsg("Enter a title before submit.");
    }
  }

  const reset = () => {
    setTitle(props.oldHike.title);
    setLength(props.oldHike.length);
    setExpTime(props.oldHike.expected_time);
    setAscent(props.oldHike.ascent);
    setDifficulty(props.oldHike.difficulty);
    setDescription(props.oldHike.description);
    setCondition(props.oldHike.hike_condition);
    setConditionDescription(props.oldHike.hike_condition_description);
    setReferencePoints(props.oldHike.reference_points);
    setErrorMsg('');
  }

  function clearErrorMsg(){
    setErrorMsg("")
  }

  return (<>
    {errorMsg ? (<Alert variant="danger" onClose={clearErrorMsg} dismissible> {errorMsg}</Alert>) : (false)}

    <Form id='editHikeForm' onSubmit={submitHikeForm} style={{ fontSize: 15, fontWeight: 'bold' }}>

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Title</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control value={title} required={true} onChange={changeTitle} />
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group>
          <Form.Label style={{ fontSize: 25 }}>Description</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text><i className="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control as="textarea" required={true} rows={3} value={description} onChange={changeDescription} />
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
            <Form.Control value={length} required={true} onChange={changeLength} placeholder="3.2" />
            <InputGroup.Text>Km</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Expected Time</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-stopwatch"></i></InputGroup.Text>
            <Form.Control value={expTime} required={true} onChange={changeExpTime} placeholder="4" />
            <InputGroup.Text>hours</InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Form.Label>Ascent</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-geo-fill"></i></InputGroup.Text>
            <Form.Control value={ascent} required={true} onChange={changeAscent} placeholder="670" />
            <InputGroup.Text>m</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Difficulty</Form.Label>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-graph-up-arrow"></i></InputGroup.Text>
            <Form.Select required={true} value={difficulty} onChange={changeDifficulty}>
              <option label=''></option>
              <option value='Tourist' label="Tourist" />
              <option value='Hiker' label="Hiker" />
              <option value='Professional hiker' label="Professional Hiker" />
            </Form.Select>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Condition</Form.Label>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-graph-up-arrow"></i></InputGroup.Text>
            <Form.Select value={condition} onChange={changeCondition}>
              <option label=''></option>
              <option value='Open' label="Open" />
              <option value='Closed' label="Closed" />
              <option value='Party Blocked' label="Party Blocked" />
              <option value='Requires Special Gear' label="Requires Special Gear" />
            </Form.Select>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Condition Description</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-textarea-t"></i></InputGroup.Text>
            <Form.Control as="textarea" value={conditionDescription} onChange={changeConditionDescription} />
          </InputGroup>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Start Point</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
            <Form.Control disabled value={startPoint} required={true} />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>End Point</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
            <Form.Control disabled value={endPoint} required={true} />
          </InputGroup>
        </Form.Group>
      </Row>
      <Form.Label style={{ fontSize: 25 }}> Click on the map to add Reference Points </Form.Label>
      <Row>
        { 
          reference_points ? [...reference_points].map( (x, index) =>{
          return (
                <>
                <div className='col-md-4 col-sm-6'>
                  <Form.Label style={{ fontSize: 25 }}> Reference Point #{index+1}</Form.Label>
                  <Form.Group as={Col}>
                    <Form.Label>Title</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control value={reference_points[index].nameLocation} onChange={(ev) => { let temp = [...reference_points]; temp[index].nameLocation = ev.target.value; changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label>Address</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control disabled value={reference_points[index].address} onChange={(ev) => { let temp = [...reference_points]; temp[index].address = ev.target.value; changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Coordinates</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control disabled value={reference_points[index].latlng.lat+','+reference_points[index].latlng.lng} onChange={(ev) => { let temp = [...reference_points]; temp[index].latlng = {lat: ev.target.value.split(',')[0], lng:ev.target.value.split(',')[1]}; changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Altitude</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><i className="bi bi-compass"></i></InputGroup.Text>
                      <Form.Control disabled value={reference_points[index].altitude} onChange={(ev) => { let temp = [...reference_points]; temp[index].altitude = ev.target.value; changeReferencePoints(temp)}} />
                    </InputGroup>
                  </Form.Group>
                </div>
              </>)
          }
          )
            : null}
            </Row>
      <Form.Group as={Col}>
        <GenericMap currentHike={[props.oldHike]} setCurrentMarkers={setReferencePoints} currentMarkers={reference_points} points={[...props.points].filter((x) => x.type != null)}
              setStartPoint={setStartPoint} setStartPointGps={setStartPointGps} setEndPoint={setEndPoint} setEndPointGps={setEndPointGps} edit = {true} linkedHuts={linkedHuts} setLinkedHuts={setLinkedHuts}
              endPoint={endPoint} startPoint={startPoint}></GenericMap>
      </Form.Group>
      <Button className='mt-y' type='submit' style={{ background: 'green' }}>Save</Button>
      <Button style={{ background: 'green' }} onClick={reset} className='ms-2 my-2'>Cancel</Button>
      <Button className='ms-2 my-2' onClick={props.returnToHome}>Home</Button>
    </Form>

  </>)
}

export { EditHike }