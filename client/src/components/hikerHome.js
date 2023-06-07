import { React, useState, useEffect } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import Profile from './profile';
import { SearchHut } from './SearchHut';
import { PerformancePage } from './PerformancePage';
import { HikesContainer } from './hikesCards';
import API from '../API';

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Hiker_Home(props) {
	const [searchHutForm, setSearchHutForm] = useState(false);
	const [performanceForm, setPerformanceForm] = useState(false);
	const [profile, setProfile] = useState(true);
	const [hikesCompleted, setHikesCompletedPage] = useState(false);
	const [hikeOnGoing, setHikeOnGoingPage] = useState(false);

	const selectHut = () => {
		setSearchHutForm(true); setPerformanceForm(false); setProfile(false); setHikesCompletedPage(false); setHikeOnGoingPage(false);
	};

	const selectPerformance = () => {
		setSearchHutForm(false); setPerformanceForm(true); setProfile(false); setHikesCompletedPage(false); setHikeOnGoingPage(false);
	};

	const selectProfile = () => {
		setSearchHutForm(false); setPerformanceForm(false); setProfile(true); setHikesCompletedPage(false); setHikeOnGoingPage(false);
	};

	const selectHikesCompleted = () => {
		setSearchHutForm(false); setPerformanceForm(false); setProfile(false); setHikesCompletedPage(true); setHikeOnGoingPage(false);
	};

	const selectHikeOnGoing = () => {
		setSearchHutForm(false); setPerformanceForm(false); setProfile(false); setHikesCompletedPage(false); setHikeOnGoingPage(true);
	};

	return (
		<Row>
			<Col xs={2}>
				<Hiker_Home_Sidebar
					setHutForm={selectHut}
					setPerForm={selectPerformance}
					setProfile={selectProfile}
					setHikesCompletedPage={selectHikesCompleted}
					setHikeOnGoingPage={selectHikeOnGoing}
				/>
			</Col>
			<Col xs={10}>
				<div>{profile ? <Profile user={props.currentUser} /> : <></>}</div>
				<div>{searchHutForm ? <SearchHut /> : <></>}</div>
				<div>{performanceForm ? <PerformancePage /> : <></>}</div>
				<div>{hikesCompleted ? <HikesCompleted user={props.currentUser} setCurrentHike={props.setCurrentHike} startHike={props.startHike} flagOnGoingHike={props.flagOnGoingHike} /> : <></>}</div>
				<div>{hikeOnGoing ? <OnGoingHike user={props.currentUser} setCurrentHike={props.setCurrentHike} endHike={props.endHike} flagOnGoingHike={props.flagOnGoingHike}/> : <></>}</div>
			</Col>
		</Row>
	)
}

function Hiker_Home_Sidebar(props) {
	return (
		<Nav className="col-md-12 d-none d-md-block sidebar">
			<div className="sidebar-sticky"></div>
			<Nav.Item>
				<Nav.Link onClick={() => props.setProfile()}>Profile</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link onClick={() => props.setHikeOnGoingPage()}>See your ongoing hike</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link onClick={() => props.setHikesCompletedPage()}>See your completed hikes</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link onClick={() => props.setHutForm()}>Search for a hut</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link onClick={() => props.setPerForm()}>Insert your performances</Nav.Link>
			</Nav.Item>			
		</Nav>
	)
}

function handleError(err) {
	toast.error(
		err.error,
		{ position: "top-center" },
		{ toastId: 12 }
	);
}

function HikesCompleted(props) {

	const [myHikes, setMyHikes] = useState([]);

	useEffect(() => {
		async function fetchHikes() {
			try {
				const fetchedHikes = await API.getFinishedHikesByHiker(props.user.username);
				console.log("fetchedHikes=")
				console.log(fetchedHikes)
				setMyHikes(fetchedHikes);
			} catch (error) {
				handleError(error);
			}
		};
		fetchHikes();
	}, []);

	return (
		<>
			<HikesContainer role={props.user.role} currentUser={props.user} hikes={myHikes} setCurrentHike={props.setCurrentHike} flagOnGoingHike={props.flagOnGoingHike} startHike={props.startHike} flagCompleted={true} />
		</>
	)
}

function OnGoingHike(props) {

	const [myHike, setMyHike] = useState([]);

	useEffect(() => {
		async function getHike() {
			try {
				const hike = await API.getOnGoingHike(props.user.username);
				setMyHike(hike);
			} catch (error) {
				handleError(error);
			}
		};
		getHike();
	}, []);

	return (
		<>
			<HikesContainer role={props.user.role} hikes={myHike} setCurrentHike={props.setCurrentHike} flag={true} endHike={props.endHike} currentUser={props.user} flagOnGoingHike={props.flagOnGoingHike} />
      {/*flag is a costant for displaying (or not) the Start Button in the hikeCard*/}
		</>
	)
}

export { Hiker_Home };