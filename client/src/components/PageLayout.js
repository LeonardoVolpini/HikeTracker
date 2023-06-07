import React, { useState } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { SearchHut } from './SearchHut';
import { HikePage } from './hikePage';
import { UserForm } from './newUserForm';
import { LoginForm } from './Auth';
import { HikesContainer } from './hikesCards';
import  FilterForm from './Filter';
import FileUploader from './UploadGpxForm';
import ClipLoader from 'react-spinners/ClipLoader';
/**
 * Except when we are waiting for the data from the server, this layout is always rendered.
 * <Outlet /> component is replaced according to which route is matching the URL.
 */


//SERVICE CARD LAYOUT FOR NO LOGGED USERS
function DefaultLayout(props) {

  const [hidden, setHidden] = useState(true);

  function changeVisibility(){
    setHidden(!hidden)
  }

  function clearButton(){
    props.setFiltered(false)
    props.setCurrentMarkers([])
  }

  return (

  <>
    { props.isLoading ? 
        (<ClipLoader color={'#fff'} size={150} />) : (
        <Container >
          <Row>
            <h1 style={{ fontWeight: 'bold', color: 'green' }}>Welcome, this is the Available Hikes List!</h1>
          </Row>
          <Row bg='white'>
            <Row >
              <Col>
                { <Button className='mt-5 mb-3'  onClick={changeVisibility}>Filter</Button> }
                {props.filtered ? <Button className='mt-5 mb-3 ms-3'  onClick={clearButton}>Clear</Button> : null }
              </Col>

            </Row>
            <Row>
              {!hidden ? <FilterForm isLoading={props.isLoading} setLoading={props.setLoading} hikes={props.hikes} setFiltered = {props.setFiltered} setFilteredHikes={props.setFilteredHikes} setHidden={setHidden} ></FilterForm> : null}
            </Row>

          </Row>
          <Row>
            {hidden ? <HikesContainer role= {props.role} name ={props.name} filter = {props.filtered} hikes={!props.filtered ? props.hikes : props.filteredHikes} setCurrentHike={props.setCurrentHike} startHike={props.startHike} currentUser={props.currentUser} flagOnGoingHike={props.flagOnGoingHike}/> : null}
          </Row>
        </Container>
        )
    }
    </>
  )
}
function FileUploadLayout(){

  return(
    <Container className='my-5'>
      <FileUploader></FileUploader>
    </Container>

  )
}

function RegisterLayout(props) {
  return (
    <Row className="vh-200">
      <Col md={12} className="below-nav">
        <UserForm CreateNewAccount={props.CreateNewAccount} checkUser={props.checkUser} sendEmail={props.sendEmail} checkCode={props.checkCode}/>
      </Col>
    </Row>
  );
}

//LOGIN LAYOUT
function LoginLayout(props) {
  return (
    <Row className="vh-200">
      <Col md={12} className="below-nav">
        <LoginForm login={props.login} />
      </Col>
    </Row>
  );
}

//MAP LAYOUT
function HikerLayout(props) {
  return (
    <Row className="vh-200">
        <HikePage currentHike={props.currentHike} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></HikePage>
    </Row>
  );  
}

//SEARCH LAYOUT
function SearchLayout(){
  return (  
    <Row className="vh-200">
        <Col md={12} className="below-nav">
          <SearchHut />
        </Col>
    </Row>
  )
}

export { LoginLayout, DefaultLayout, HikerLayout, FileUploadLayout,RegisterLayout, SearchLayout };