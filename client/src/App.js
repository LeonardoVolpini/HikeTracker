import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";

import React, { useState, useEffect, useContext, } from 'react';
import { Container, Toast } from 'react-bootstrap/';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { DefaultLayout, LoginLayout, HikerLayout, RegisterLayout } from './components/PageLayout';

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Navigation } from './components/Navigation';
import { LocalGuide_Home } from './components/localGuideHome';
import { Hiker_Home } from './components/hikerHome';

import {  ManagerPage } from './components/managerPage';

import MessageContext from './messageCtx';
import API from './API';
import { EditHike } from './components/editHike';
import { PointsContainer } from './components/pointsCards';


function App() {

  const [message, setMessage] = useState('');

  const handleErrors = (err) => {
    setMessage(err.error); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

  //
  //DO NOT IMPLEMENTS ROUTE HERE
  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className="App">
          <Routes>
            <Route path="/*" element={<Main />/*<LocalGuide_Home/>*/} />
          </Routes>
          { }
          <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  )
}

function Main() {
  /************AUTHENTICATION VARIABLES*****************/

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentHike, setCurrentHike] = useState([]);
  const [points, setPoints] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [profilePage, setProfilePage] = useState(false);
  //Remember to clear the current markers if the user leaves the page
  const [currentMarkers, setCurrentMarkers] = useState([]);

  const [hikes, setHikes] = useState([]);
  const [reqList, setReqList] = useState([]);
  const [filteredHikes, setFilteredHikes] = useState([])
  const [filtered, setFiltered] = useState(false)
  const [onChangeHikes, setOnChangeHikes] = useState(true);
  const [onChangePoints, setOnChangePoints] = useState(true);

  const [flagOnGoingHike, setFlagOnGoingHike] = useState(false); //if it is true -> there is an hike in progress for the currentUser

  function handleError(err) {

    toast.error(
      err.error,
      { position: "top-center" },
      { toastId: 12 }
    );

  }

  const { handleErrors } = useContext(MessageContext);

  useEffect(() => {
    async function fetchInitialValues() {
      try {
        const fetchedPoints = await API.getPoints();
        setPoints(fetchedPoints);
      } catch (error) {
        handleErrors(error);
      }
    };
    if (onChangePoints) {
      setOnChangePoints(false)
      fetchInitialValues();
    }
  }, [onChangePoints]);

  useEffect(() => {
    async function fetchHikes() {
      try {
        const fetchedHikes = await API.getHikes();
        getReqList();
        setHikes(fetchedHikes);
      } catch (error) {
        handleErrors(error);
      }
    };
    if (onChangeHikes) {
      setOnChangeHikes(false)
      fetchHikes();
    }

  }, [onChangeHikes]);

  //*******CHECK_AUTH*******//
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user_curr = await API.getUserInfo(); // we have the user info here
        user_curr.name === 'Guest' ? setLoggedIn(false) : setLoggedIn(true);
        user_curr.role === 'Admin' && navigate ('/manager'); 
        getReqList();
        setCurrentUser(user_curr);
      } catch (err) {
        handleError(err); // mostly unauthenticated user, thus set not logged in
        setCurrentUser({});
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, [loggedIn]); // eslint-disable-line
  //***********************//

  //********HANDLE_LOGIN*******//
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setCurrentUser(user);
      const hike = await API.getOnGoingHike(user.username);
      if (hike.length!==0) {
        setFlagOnGoingHike(true);
      }
    } catch (err) {
      handleError(err);
    }
  };
  //*****************************//

  //********HANDLE_LOGOUT*******//
  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);

      //BEST PRACTISE after Logout-->Clean up everything!
      setCurrentUser({});
      setFlagOnGoingHike(false);
    } catch (err) {
      handleError(err);
    }
  };
  /*****************************************************/

  //********HANDLE_REGISTER*******//
  const CreateNewAccount = async (user) => {
    await API.addUser(user);
  };

  const checkUser = async (email) => {
    const u = await API.checkUser(email);
    return u.error ? true : false
  };

  const deleteReq = async(email) =>{
    await API.deleteReq(email);

  }
  /*****************************************************/

  //********HANDLE_ADD_POINT*******//
  const CreateNewPoint = async (point) => {
    try {
      let point= await API.addPoint(point)
      return point
    } catch (err) {
      handleError(err);
    }
  };

  //********HANDLE_ADD_HUT*******//
  const CreateNewHut = async (hut) => {
    try {
      await API.addHut(hut)
    } catch (err) {
      handleError(err);
    }
  };

  //********HANDLE_NEW_HIKE*******//
  const CreateNewHike = async (hike) => {
    try {
      await API.addNewHike(hike)
    } catch (err) {
      handleError(err);
    }
  };

  const updateHike = async (oldHikeTitle, hike) => {
    try {
      await API.updateHike(oldHikeTitle, hike)
    } catch (err) {
      handleError(err);
    }
  };

  //********HANDLE_VERIFICATION_CODE*******//
  const sendEmail = async (email,user) => {

    await API.sendEmail(email,user);
  }

  const getReqList = async () => {

   const r = await API.getAllRequests();
    setReqList(r);
  }

  const sendNotice1 = async (email) => {
    await API.sendNotice1(email);
  }
  const sendNotice2 = async (email) => {
    await API.sendNotice2(email);
  }

  const checkCode = async (email) => {

    const c = await API.checkCode(email);
    return c.code;

  }

  function profilePageSwitch() {
    if (profilePage)
      navigate('/');
    else
      navigate('/profile');
  }

  function returnToHome() {
    navigate('/');
  }

  const startHike = async (hiker_email, hike_title, start_time) => {
    try {
      await API.startHike(hiker_email, hike_title, start_time);
      setFlagOnGoingHike(true);
    } catch (err) {
      handleError(err);
    }
  };

  const endHike = async (hiker_email, hike_title, start_time, end_time) => {
    try {
      await API.updateEndTime(hiker_email, hike_title, start_time, end_time);
      const duration = calculateDuration(start_time, end_time);
      const flag = await API.checkFirstTime(hiker_email, hike_title);
      if(flag==0) {
        await API.endHike(hiker_email, hike_title, duration);
      }
      else{
        await API.updateEndHike(hiker_email, hike_title, duration);
      }
      setFlagOnGoingHike(false);
    } catch (err) {
      handleError(err);
    }
  };

  function calculateDuration(start_time, end_time) {
    let duration = 0;
    //an hike can be longer than a day?
    const start = new Date(start_time);
    const end = new Date(end_time);
    duration = Math.floor((end.getTime() - start.getTime())/60000)
    return duration;
  }


  /*****************************************************/

  return (
    <>
      <Navigation logout={handleLogout} user={currentUser} loggedIn={loggedIn} setCurrentMarkers={setCurrentMarkers} profilePage={profilePageSwitch} />
      <Routes>
        <Route path="/" element={
          loggedIn && currentUser.role == 'LocalGuide' ? <LocalGuide_Home CreateNewPoint={CreateNewPoint} CreateNewHut={CreateNewHut} CreateNewHike={CreateNewHike}
            currentMarkers={currentMarkers} setCurrentMarkers={setCurrentMarkers} hikes={hikes} currentUser={currentUser} setCurrentHike={setCurrentHike} points={points}
            setOnChangeHikes={setOnChangeHikes} setOnChangePoints={setOnChangePoints} /> :
            <DefaultLayout role={loggedIn ? currentUser.role : ''} isLoading={isLoading} filteredHikes={filteredHikes}
             setFilteredHikes={setFilteredHikes} filtered={filtered} setFiltered={setFiltered} setLoading={setLoading} setCurrentHike={setCurrentHike}
            hikes={hikes} startHike={startHike} currentUser={currentUser ? currentUser: ''} flagOnGoingHike={flagOnGoingHike} />  /*<FileUploadLayout></FileUploadLayout>*/
        } >
        </Route>
        <Route path="/manager" element={
          loggedIn && currentUser.role == 'Admin' ? <ManagerPage list={reqList} CreateNewAccount={CreateNewAccount} deleteReq={deleteReq} sendNotice1={sendNotice1} sendNotice2={sendNotice2}/> : <Navigate replace to='/' />
        } >
        </Route>
        {/* <Route path="/NewHike" element={<HikeForm/>} /> THIS WAS A TRY TO DO THE .GPX FILE UPLOAD.*/}
        <Route path="/map" element={loggedIn && currentUser.role == 'Hiker' && currentHike.length != 0 ? <HikerLayout currentHike={currentHike} currentMarkers={currentMarkers} setCurrentMarkers={setCurrentMarkers} /> : <Navigate replace to='/' />} />
        <Route path="/points" element={<PointsContainer points={points}></PointsContainer>} />
        <Route path="/register" element={!loggedIn ? <RegisterLayout CreateNewAccount={CreateNewAccount} checkUser={checkUser} checkCode={checkCode} sendEmail={sendEmail} /> : <Navigate replace to='/' />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
        <Route path="/profile" element={loggedIn && currentUser.role == 'Hiker' ? <Hiker_Home currentUser={currentUser} setCurrentHike={setCurrentHike} endHike={endHike} startHike={startHike} flagOnGoingHike={flagOnGoingHike} /> : <Navigate replace to='/' />} />
        <Route path="/editHike" element={loggedIn && currentUser.role == 'LocalGuide' ? <EditHike updateHike={updateHike} returnToHome={returnToHome} currentHike={currentHike} points={points} setOnChangeHikes={setOnChangeHikes} currentMarkers={currentMarkers}/> : <Navigate replace to='/' />} />
        {/* <Route path="/manager" element={<ManagerPage list={reqList} CreateNewAccount={CreateNewAccount}></ManagerPage>} /> */}
        {/*<Route path="/startHike" element={loggedIn && currentUser.role == 'Hiker' ? <Hiker_Home currentUser={currentUser} setCurrentHike={setCurrentHike} endHike={endHike} flagOnGoingHike={flagOnGoingHike} /> : <Navigate replace to='/' />} />*/}
      </Routes>
    </>
  );
}

export default App;
