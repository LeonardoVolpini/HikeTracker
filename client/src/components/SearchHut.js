import { Button, Form, Col, Row, Card, InputGroup, ListGroup } from 'react-bootstrap';
import { useEffect, useState, useContext, React } from 'react';
import { UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';
import API from '../API';
import MessageContext from '../messageCtx';

const URL = 'http://localhost:3001/api/Pictures';


function hutMapping(dbHuts) {
  let newHuts = [];
  newHuts = dbHuts.map((h) => {
    return {
      name: h.nameLocation, address: h.address, latitude: h.gps_coordinates.split(',')[0], longitude: h.gps_coordinates.split(',')[1],
      altitude: h.altitude, capacity: h.capacity, phone: h.phone, email: h.email, web_site: h.web_site, description: h.description, picture: h.picture
    }
  });
  console.log(newHuts);
  return newHuts;
}

function HutContainer(props) {
  const huts = props.huts;
  return (
    <div className="d-flex justify-content-start flex-wrap">
      {huts.length != 0 ? huts.map((hut) => { return (<HutCard key={hut.address} name={hut.name} address={hut.address} latitude={hut.latitude} longitude={hut.longitude} altitude={hut.altitude} capacity={hut.capacity} phone={hut.phone} email={hut.email} web_site={hut.web_site} description={hut.description}  picture={hut.picture}/>) }) : <h4>No result found</h4>}
    </div>
  );
}

function filterCheck(arg, filter) {
  if (arg === null) {
    return true;
  }
  else if (filter == '') {
    return true;
  }
  else if (arg.toLowerCase().includes(filter.toLowerCase())) {
    return true;
  }
  else return false;
}

function filterInt(arg, filter) {
  if (arg == null) {
    return true;
  }
  else if (filter == 0) {
    return true;
  }
  else if (arg == filter) {
    return true;
  }
  else { return false; }
}

function filterDouble(arg, filter) {
  console.log(Math.floor(arg), Math.floor(filter))
  if (arg === null) {
    return true;
  }
  else if (filter == '') {
    return true;
  }
  else if (Math.floor(arg) == Math.floor(filter)) {
    return true
  }
  else return false;
}


function HutCard(props) {

  const [picName, setPicName]= useState('');

  useEffect(() => {
    let name= URL + "/" + props.picture
    setPicName(name)
  }, [props])

  return (
    <Card className="mx-1 my-1" border='primary' style={{ width: '25rem' }}>
      
      <Card.Img variant="top" src={picName} />

      <Card.Body>
        <Card.Title style={{ fontWeight: 'bold', color: 'success' }}> {props.name}</Card.Title>

        <ListGroup className="list-group-flush">

          <ListGroup.Item style={{ fontWeight: 'bold', fontSize: 13 }}>
            <Row>
              <div><i class="bi bi-signpost"></i> Address :</div> 
              <div style={{ fontWeight: 'normal' }}> {props.address} </div> 
            </Row>
            <Row>
              <Col>
              <div><i className="bi bi-compass"></i> Latitude : </div> 
              <div style={{ fontWeight: 'normal' }}> {props.latitude} </div> 
              </Col>
              <Col>
              <div><i className="bi bi-compass"></i> Longitude : </div>
              <div style={{ fontWeight: 'normal' }}> {props.longitude} </div>
              </Col>
            </Row>
            <Row>
              <div><i class="bi bi-geo-fill"></i> Altitude : </div>
              <div style={{ fontWeight: 'normal' }}> {props.altitude} </div>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item style={{ fontWeight: 'bold', fontSize: 13 }}>
            <Row><Card.Text style={{fontSize: 18}}>Contacts</Card.Text></Row>
            <Row >
              <div><i class="bi bi-telephone"></i> Phone : </div>
              <div style={{ fontWeight: 'normal' }}>{props.phone}</div>
            </Row>
            <Row>
              <div><i class="bi bi-envelope"></i> Email :</div>
              <div style={{ fontWeight: 'normal' }}>{props.email}</div>
            </Row>
              {props.web_site != '' ? <Row><div><i class="bi bi-globe2"></i> Web site:</div><div style={{ fontWeight: 'normal' }}> {props.web_site}</div></Row> : <></>}

          </ListGroup.Item>
              
          <ListGroup.Item style={{ fontWeight: 'bold', fontSize: 13 }}>
            <div><i class="bi bi-person-plus"></i> Number of beds : </div>
            <div style={{ fontWeight: 'normal' }}>{props.capacity}</div>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row><Card.Text style={{fontWeight:'bold', fontSize: 18}}>Description</Card.Text></Row>
            <Row><Card.Text>{props.description}</Card.Text></Row>
          </ListGroup.Item>

        </ListGroup>

      </Card.Body>
    </Card>
  );
}

//Called in PageLayout.SearchLayout and SearchLayout is called in App
function SearchHut() {

  const { handleErrors } = useContext(MessageContext);
  const [huts, setHuts] = useState([]);
  const [filteredHuts, setFilteredHuts] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [latFilter, setLatFilter] = useState("");
  const [longFilter, setLongFilter] = useState("");
  const [geoFilter, setGeoFilter] = useState("");
  const [altFilter, setAltFilter] = useState(0);
  const [capacityFilter, setCapacityFilter] = useState(0);
  const [filters, setFilters] = useState(false);

  function changeGeoFilter(event){
    setGeoFilter(event.target.value)
  }

  function changeLatFilter(event){
    setLatFilter(event.target.value)
  }

  function changeLongFilter(event){
    setLongFilter(event.target.value)
  }

  function changeAltFilter(event){
    setAltFilter(event.target.value)
  }

  function changeNameFilter(event){
    setNameFilter(event.target.value)
  }

  function changeCapacityFilter(event){
    setCapacityFilter(event.target.value)
  }

  function applyFilters(){
    setFilters(true)
  }

  function resetFilters(){
    setFilters(false)
  }

  async function getHuts() {
    try {
      const list = await API.getHuts();
      const newList = hutMapping(list);
      setHuts(newList);
    } catch (e) {
      handleErrors(e);
    }
  }

  useEffect(() => {
    setFilteredHuts(huts.filter((h) => {
      return filterCheck(h.name, nameFilter) && filterCheck(h.address, geoFilter) &&
        filterDouble(h.latitude, latFilter) && filterDouble(h.longitude, longFilter) &&
        filterInt(h.altitude, altFilter) && filterInt(h.capacity, capacityFilter)
    }))
  }, [filters]);

  useEffect(() => {
    getHuts();
  }, []);

  useEffect(() => {
    setFilters(false)
  }, [geoFilter, nameFilter, longFilter, latFilter, altFilter, capacityFilter]);

  return (
    <Col className="vh-100 justify-content-md-center">
      <Row>
        <Form style={{fontSize:15, fontWeight:'bold'}}>
          <Row>
              <Form.Label style={{fontSize: 25}}>Geographical Informations</Form.Label>
          </Row>
          <Form.Group controlId="geo">
            <Form.Label>Address</Form.Label>
              <InputGroup className='mb-2'>
                <InputGroup.Text><i class="bi bi-signpost"></i></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter the address of the hut"
                  value={geoFilter} onChange={changeGeoFilter}
                />
              </InputGroup>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Latitude</Form.Label>
                <InputGroup className='mb-2'>
                  <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
                  <Form.Control
                    type="number" step="0.0000001"
                    min="-90.0000000" max="90.0000000"
                    placeholder='Enter the latitude'
                    value={latFilter} onChange={changeLatFilter}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Longitude</Form.Label>
                <InputGroup className='mb-2'>
                  <InputGroup.Text><i class="bi bi-compass"></i></InputGroup.Text>
                  <Form.Control
                    type="number" step="0.0000001"
                    min="-180.0000000" max="180.0000000"
                    placeholder='Enter the longitude'
                    value={longFilter} onChange={changeLongFilter}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Altitude</Form.Label>
                <InputGroup className='mb-2'>
                  <InputGroup.Text><i class="bi bi-geo-fill"></i></InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="0" max="4000"
                    placeholder='Enter the altitude'
                    value={altFilter} onChange={changeAltFilter}
                  />
                  <InputGroup.Text>m</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
              <Form.Label style={{fontSize: 25}}>Hut's Details</Form.Label>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <InputGroup className='mb-2'>
                  <InputGroup.Text><i class="bi bi-house"></i></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter the name of the hut"
                    value={nameFilter} onChange={changeNameFilter}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Number of beds</Form.Label>
                <InputGroup className='mb-2'>
                  <InputGroup.Text><i class="bi bi-person-plus"></i></InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="0" max="30"
                    placeholder='Enter the numeber of beds'
                    value={capacityFilter} onChange={changeCapacityFilter}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Button className="mt-3 me-3" onClick={applyFilters}>Search</Button>
          <Button className="mt-3" type='reset' onClick={resetFilters}>Reset Filters</Button>
        </Form>
      </Row>
      <br />
      <Row>
        {filters ? <HutContainer huts={filteredHuts} /> : <HutContainer huts={huts} />}
      </Row>
    </Col>
  )
}

function SearchHutButton(props) {

  const useBackListener = (callback) => { // Handler for the back button
    const navigator = useContext(UNSAFE_NavigationContext).navigator;
    useEffect(() => {
      const listener = ({ location, action }) => {
        console.log("listener", { location, action });
        if (action === "POP") {
          callback({ location, action });
        }
      };
      const unlisten = navigator.listen(listener);
      return unlisten;
    }, [callback, navigator]);
  };

  useBackListener(({ location }) => {
    console.log("Navigated Back", { location });
    if (props.searchPage) { props.setSearchPage(false); }
  });

  const navigate = useNavigate();
  if (props.searchPage) {
    return (
      <Button variant="outline-light" floating='right' onClick={() => { props.setSearchPage(false); navigate('/') }}>Home</Button>
    )
  } else {
    return (
      <Button variant="outline-light" floating='right' onClick={() => { props.setSearchPage(true); navigate('/searchHut') }}>Search Hut</Button>
    )
  }
}

export { SearchHut, SearchHutButton };