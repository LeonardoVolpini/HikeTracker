import { Col, Row, ToggleButton, ButtonGroup, Button, Container } from 'react-bootstrap';
import { HikesContainer } from './hikesCards';
import { MapContainer, Polyline, TileLayer, Marker, Popup, useMapEvents, GeoJSON, useMap, Circle, LayerGroup, } from 'react-leaflet'
import * as L from "leaflet";
import { React, useEffect, useRef, useState } from 'react';
import API from '../API';
import redIcon from './imgUtils/redIcon.png'
import greenIcon from './imgUtils/greenIcon.png'
import blueIcon from './imgUtils/blueIcon.png'
import houseRed from './imgUtils/houseRed.png'
import houseGreen from './imgUtils/houseGreen.png'
import houseBlue from './imgUtils/houseBlue.png'
import houseOrange from './imgUtils/houseOrange.png'
import houseBlue2 from './imgUtils/houseBlue2.png'
import housePink from './imgUtils/housePink.png'
import houseViolet from './imgUtils/houseViolet.png'
import housePink2 from './imgUtils/housePink2.png'
import refPin from './imgUtils/refPin.png'
import pRed from './imgUtils/pRed.png'
import pGreen from './imgUtils/pGreen.png'
import pBlue from './imgUtils/pBlue.png'
import pOrange from './imgUtils/pOrange.png'
// THE GPX FILE MUST BE PASSED AS AN STRING.

const crypto = window.crypto || window.msCrypto;
let array = new Uint32Array(1);

const $ = require("jquery");

// I took it from here: https://stackoverflow.com/a/27943/12249045
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) { //Calc distance between two points
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}


function refDistance(latlng, positions) { //Get the min distance to from a point to a set of points
    let min = 0.5
    let point = {}
    positions.forEach(p => {
        let x = getDistanceFromLatLonInKm(latlng.lat, latlng.lng, p[0], p[1])
        if (x <= min) {
            point = p;
            min = x
        }
    })
    return {lat: point[0], lng: point[1], alt: point[2]}
}

function distanceRespectHikes(latlng, list) {
    return [...list].map((x) => {
        return { hike: x.hike, minDist: getDistanceFromLatLonInKm(latlng.lat, latlng.lng, x.start.split(',')[0], x.start.split(',')[1]) }
    })

}

function HikePage(props) {
    return (
        <Container>
            <Row className='my-3'>
                <Col sm={3}>
                    {props.currentHike.length > 0 ?
                        <HikesContainer hikes={props.currentHike}></HikesContainer> 
                        :
                        <div>No map has been selected selected</div>
                    }
                </Col>
                <Col  >
                    <GenericMap currentHike={props.currentHike} currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} hiker={true} ></GenericMap>
                </Col>
            </Row>
        </Container>
    )

};

const redMarker = L.icon({
    iconUrl:  redIcon,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const greenMarker = L.icon({
    iconUrl:  greenIcon,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const blueMarker = L.icon({
    iconUrl:  blueIcon,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const redHouse = L.icon({
    iconUrl:  houseRed,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const greenHouse = L.icon({
    iconUrl:  houseGreen,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const blueHouse = L.icon({
    iconUrl:  houseBlue,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const orangeHouse = L.icon({
    iconUrl:  houseOrange,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
    //Use the parameters below to show the icon slightly on right of the original point
    /*iconAnchor:   [40, 32],
    popupAnchor:  [-24, -24]
    */
})
const pinkHouse = L.icon({
    iconUrl:  housePink,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const pink2House = L.icon({
    iconUrl:  housePink2,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const violetHouse = L.icon({
    iconUrl:  houseViolet,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const refPoints = L.icon({
    iconUrl:  refPin,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const blue2House = L.icon({
    iconUrl:  houseBlue2,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const redParking = L.icon({
    iconUrl:  pRed,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const blueParking = L.icon({
    iconUrl:  pBlue,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const orangeParking = L.icon({
    iconUrl:  pOrange,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})
const greenParking = L.icon({
    iconUrl:  pGreen,
    iconSize:     [32, 32],
    iconAnchor:   [16, 32],
    popupAnchor:  [0, -24]
})

function GenericMap(props) { //Map to be inserted anywhere. 
    /*
    REQUIRES THE FOLLOWING PROPS:
        -'currentMarkers':An array of the markers to draw on the map (Can be empty)
        -'setCurrentMarkers': State setter of currentMarkers
    OPTIONAL:
        -'currentHike': A hike to be ploted. Can be skiped. Must be a GeoJSON to be plotted.
    */

    const [map,setMap] = useState('')
    const [positions, setPositions] = useState([])
    const mapList = useRef([])
    const [startPoint, setStartPoint] = useState(props.startPoint ? props.startPoint : '')
    const [endPoint, setEndPoint] = useState(props.endPoint ? props.endPoint : '')
    const [startCheck, setStartCheck] = useState('');
    const [endCheck, setEndCheck] = useState('');
    const travelOnce = useRef('');

    function MyComponent() {
        const map = useMap()
        if(travelOnce.current != positions){
            travelOnce.current = positions
            map.setView(positions[Math.round(positions.length / 2)], positions.length / 100 > 1 ? 13 : 15);
            
        }

        return null
    }
    function setupPos(map){
        // The commented stuff is only required if we are not passing a GeoJSON
        let gpxParser = require('gpxparser');
        let gpx = new gpxParser()
        gpx.parse(map)
        let geoJSON = gpx.toGeoJSON()
        //let geoJSON = JSON.parse(props.currentHike[0].gpx_track) //Get the object from a string
        // console.log(JSON.stringify(geoJSON))
        //var positions = gpx.tracks[0].points.map(p => [p.lat, p.lon,p.ele]).filter((p)=> p[2]!=null)
        setMap(geoJSON);
        setPositions(geoJSON.features[0].geometry.coordinates.map(p => [p[1], p[0], p[2]]).filter((p) => p[2] != null));
    }
    async function gpxmap(name, hike = null) {
        try {
            const map = await API.getMap(name);
            setupPos(map);
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    useEffect(() => {
        if (props.currentHike.length > 0) {
            gpxmap(props.currentHike[0].gpx_track.replace(/\s/g, ''))
        }
        else if (props.gpxFile) {
            setupPos(props.gpxFile)
        } else if (props.hikes) {
            props.hikes.forEach((h) => {
                if (mapList.current.filter((x) => x.hike == h ? true : false).length == 0 || mapList.length == 0) {
                    mapList.current.push({ hike: h, start: h.start_point_coordinates })
                }
            })
        }
    }, [props.gpxFile, props.hikes]);
    useEffect(() => {
        if (props.currentMarkers.length != 0 && props.currentMarkers.some((x) => !x.distHikes)) {
            let currentMarkersMod = [...props.currentMarkers].map((x) => {
                if (!x.distHikes) {
                    let dist = distanceRespectHikes(x.latlng, mapList.current)
                    return { nameLocation: x.nameLocation, altitude: x.altitude, latlng: x.latlng, address: x.address, distHikes: dist }
                }
                else
                    return { nameLocation: x.nameLocation, altitude: x.altitude, latlng: x.latlng, address: x.address, distHikes: x.distHikes }
            })
            props.setCurrentMarkers(currentMarkersMod)
        }
    }, [props.currentMarkers, mapList.current])
    useEffect(() => {
        if(positions.length != 0){

            if(!props.edit){
                $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[0][0] + '&lon=' + positions[0][1] + '&format=json&limit=1&q=', function (data) {
                    if(props.points){
                        props.setStartPoint(data.display_name);
                        props.setStartPointGps(positions[0][0] + ',' + positions[0][1])
                    }
                    setStartPoint(data.display_name)
                    setStartCheck(positions[0][0] + ',' + positions[0][1])
                    if(!props.hiker){
                        props.setStartPointGps(positions[0][0] + ',' + positions[0][1])
                        console.log('first start')
                    }
                    
                })
            }
            else{
                setStartPoint(props.currentHike[0].start_point_address)
                setStartCheck(props.currentHike[0].start_point_coordinates.replace(/\s/g, ''))
                props.setStartPointGps(props.currentHike[0].start_point_coordinates.replace(/\s/g, ''))
            }
            if(!props.edit){
                $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + positions[positions.length - 1][0] + '&lon=' + positions[positions.length - 1][1] + '&format=json&limit=1&q=', function (data) {
                    if(props.points){
                        props.setEndPoint(data.display_name);
                        props.setEndPointGps(positions[positions.length - 1][0]+','+positions[positions.length - 1][1])
                    }
                    setEndPoint(data.display_name)
                    setEndCheck(positions[positions.length - 1][0]+','+positions[positions.length - 1][1])
                    if(!props.hiker){
                        props.setEndPointGps(positions[positions.length - 1][0]+','+positions[positions.length - 1][1])
                        console.log('first end')
                    }
    
                })
            }
            else{
                setEndPoint(props.currentHike[0].end_point_address)
                setEndCheck(props.currentHike[0].end_point_coordinates.replace(/\s/g, ''))
                props.setEndPointGps(props.currentHike[0].end_point_coordinates.replace(/\s/g, ''))

            }  

    }
    }, [positions])

    function calcMinDistance(latlng) { //Get the min distance to from a point to a set of points
        let distances = []
        positions.forEach(p => {
            distances.push(getDistanceFromLatLonInKm(latlng.lat, latlng.lng, p[0], p[1]))
        })
        return Math.min(...distances)
    }

    function deleteLinkedHut(p){
        const tempLH = [...props.linkedHuts]; 
        tempLH.splice(tempLH.indexOf(tempLH.find(x=>{ return x.gps_coordinates == p.gps_coordinates})),1); 
        props.setLinkedHuts(tempLH)
    }
    function checkLinkedHut(p){
        return props.linkedHuts ? props.linkedHuts.find(x=>{return x.gps_coordinates == p.gps_coordinates}) ? true : false : false
    }
    if (map != '' && positions.length != 0) {
        /*
        Thanks to the stopPropagation function when u click something in the pop up the map is not triggered, the first 2 marker show the start and end point,
        the others are used for huts and parking lots.
        */
        return (
            <>{map != '' ?

                <MapContainer
                    center={positions[Math.round(positions.length / 2)]}
                    zoom={positions.length / 100 > 1 ? 13 : 15}
                    scrollWheelZoom={true}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {/* This object below is needed if we are passing the path line as a parsed XML, not as a GeoJSON */}
                    <Polyline
                        pathOptions={{ fillColor: 'red', color: 'blue' }}
                        positions={positions}
                    />
                    <Marker key={crypto.getRandomValues(array)} icon={positions[0][0] + ',' + positions[0][1] == startCheck? greenMarker : blueMarker} position={positions[0]}>
                        <Popup closeOnClick={false}>
                            {startPoint}
                            <hr></hr>
                            {'Start Point'}
                            {props.points ?
                                <>
                                    <hr></hr>
                                    <ToggleButton
                                        className="mb-2"
                                        id="toggle-start"
                                        type="checkbox"
                                        variant="outline-success"
                                        checked={positions[0][0] + ',' + positions[0][1] == startCheck}
                                        onChange={(e) => {e.stopPropagation(); setStartCheck(positions[0][0] + ',' + positions[0][1]); props.setStartPoint(startPoint); props.setStartPointGps(positions[0][0] + ',' + positions[0][1]); console.log('change on initial start');}}
                                    >
                                        Start Point
                                    </ToggleButton>
                                </>
                                : null}
                        </Popup>
                    </Marker>
                    <Marker key={ crypto.getRandomValues(array)} icon={positions[positions.length - 1][0]+','+positions[positions.length - 1][1] == endCheck ? redMarker : blueMarker} position={positions[positions.length - 1]}>
                        <Popup closeOnClick={false}>
                            {endPoint}
                            <hr></hr>
                            {'End Point'}

                            {props.points ?
                                <>
                                    <hr></hr>
                                    <ToggleButton
                                        className="mb-2"
                                        id="toggle-end"
                                        type="checkbox"
                                        variant="outline-danger"
                                        checked={positions[positions.length - 1][0]+','+positions[positions.length - 1][1] == endCheck}
                                        onChange={(e) => { e.stopPropagation(); setEndCheck(positions[positions.length - 1][0]+','+positions[positions.length - 1][1]); props.setEndPoint(endPoint); props.setEndPointGps(positions[positions.length - 1][0]+','+positions[positions.length - 1][1]); console.log('change on initial end');}}
                                    >
                                        End Point
                                    </ToggleButton>
                                </>
                                : null}

                        </Popup>
                    </Marker>
                    {/*The following marker show the parking lots and huts at max 5km form start and end point, if we are in edit page will not show the huts
                    because they will showed in an other specifc marker*/}
                    {props.points ? [...props.points].filter((x) => { return getDistanceFromLatLonInKm(x.gps_coordinates.split(',')[0], x.gps_coordinates.split(',')[1], positions[0][0],positions[0][1]) <= 5 || getDistanceFromLatLonInKm(x.gps_coordinates.split(',')[0], x.gps_coordinates.split(',')[1], positions[positions.length -1][0],positions[positions.length -1][1]) <=5 && (props.edit && x.type!='Hut') }).map((p) => {
                        return (
                            <Marker icon={p.gps_coordinates == startCheck && p.gps_coordinates == endCheck ? p.type=='Hut' ? orangeHouse : orangeParking : 
                                            p.gps_coordinates == startCheck ? p.type=='Hut' ? greenHouse: greenParking : 
                                            p.gps_coordinates == endCheck ? p.type=='Hut' ? redHouse : redParking : 
                                            p.type=='Hut' ? blueHouse : blueParking} 
                            key={ crypto.getRandomValues(array)} position={{ lat: p.gps_coordinates.split(',')[0], lng: p.gps_coordinates.split(',')[1] }}>

                                <Popup closeOnClick={false}>
                                    {p.nameLocation}
                                    <hr></hr>
                                    {p.address}
                                    <hr></hr>
                                    {p.type}
                                    <hr></hr>

                                    <ButtonGroup>

                                        <ToggleButton
                                            className="mb-2"
                                            id="toggle-startp"
                                            type="checkbox"
                                            variant="outline-success"
                                            checked={p.gps_coordinates == startCheck}
                                            onChange={(e) => {e.stopPropagation(); setStartCheck(p.gps_coordinates); props.setStartPoint(p.address); props.setStartPointGps(p.gps_coordinates);
                                                console.log('change on start');}}
                                        >
                                            Start Point
                                        </ToggleButton>
                                        <ToggleButton
                                            className="mb-2"
                                            id="toggle-endp"
                                            type="checkbox"
                                            variant="outline-danger"
                                            checked={p.gps_coordinates == endCheck}
                                            onChange={(e) => {e.stopPropagation(); setEndCheck(p.gps_coordinates); props.setEndPoint(p.address); props.setEndPointGps(p.gps_coordinates);
                                                console.log('change on end');}}
                                        >
                                            End Point
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Popup>
                            </Marker>
                        )
                    }) : null}
                    {/*What should be added? 
                        - A way to link every hut (marked as linked) to the hut
                        - A way to check if the hut is linked
                        - Add the list of linked hut to the hike on save.
                        A blue2House icon and a pinkHouse icon have been created to manage not linked or Linked, if it is a start point/end point or both the colour must be the same used without(green,red,orange) considering the link
                    */}

                    {/*The following marker shows the huts in the edit page giving the possibility to link them to the hike, chose them as start point or both*/}
                    
                    {props.points && props.edit ? [...props.points].filter((x) => { return calcMinDistance({ lat: x.gps_coordinates.split(',')[0], lng: x.gps_coordinates.split(',')[1]}) <= 5 && x.type=='Hut'}).map((p) => {
                        return (
                            <Marker icon={  (p.gps_coordinates == startCheck && p.gps_coordinates == endCheck) && checkLinkedHut(p) ? pinkHouse :
                                            p.gps_coordinates == startCheck && checkLinkedHut(p) ? violetHouse :
                                            p.gps_coordinates == endCheck && checkLinkedHut(p) ? pink2House :
                                            checkLinkedHut(p) ? blue2House :
                                            p.gps_coordinates == startCheck && p.gps_coordinates == endCheck ? orangeHouse : 
                                            p.gps_coordinates == startCheck ? greenHouse : p.gps_coordinates == endCheck ? redHouse : blueHouse} 
                            
                            key={ crypto.getRandomValues(array)} position={{ lat: p.gps_coordinates.split(',')[0], lng: p.gps_coordinates.split(',')[1] }}>
                            <Popup closeOnClick={false}>
                                {p.nameLocation}
                                <hr></hr>
                                {p.address}
                                <hr></hr>
                                {p.type}
                                <hr></hr>

                                <ButtonGroup>
                                {getDistanceFromLatLonInKm(p.gps_coordinates.split(',')[0], p.gps_coordinates.split(',')[1], positions[0][0],positions[0][1]) <= 5 || getDistanceFromLatLonInKm(p.gps_coordinates.split(',')[0], p.gps_coordinates.split(',')[1], positions[positions.length -1][0],positions[positions.length -1][1]) <=5 ?
                                    <>
                                        <Col>
                                            <ToggleButton
                                                className="mb-2"
                                                id="toggle-start"
                                                type="checkbox"
                                                variant="outline-success"
                                                checked={p.gps_coordinates == startCheck}
                                                onChange={(e) => {e.stopPropagation(); setStartCheck(p.gps_coordinates); props.setStartPoint(p.address); props.setStartPointGps(p.gps_coordinates);
                                                    console.log('change on start');}}
                                            >
                                                Start Point
                                            </ToggleButton>
                                            <ToggleButton
                                                className="mb-2"
                                                id="toggle-end"
                                                type="checkbox"
                                                variant="outline-danger"
                                                checked={p.gps_coordinates == endCheck}
                                                onChange={(e) => {e.stopPropagation(); setEndCheck(p.gps_coordinates); props.setEndPoint(p.address); props.setEndPointGps(p.gps_coordinates);
                                                    console.log('change on end');}}
                                            >
                                                End Point
                                            </ToggleButton>
                                        </Col>

                                    </> :
                                    null
                                    }
                                    <Col>
                                        <ToggleButton
                                            className="mb-2"
                                            id="toggle-link"
                                            type="checkbox"
                                            variant="outline-success"
                                            checked={checkLinkedHut(p)}
                                            onChange={(e) => {e.stopPropagation(); let tempLH = [...props.linkedHuts]; tempLH.push(p); props.setLinkedHuts(tempLH) }}
                                        >
                                            Link to Hike
                                        </ToggleButton>
                                        <Button
                                            className="mb-2"
                                            id="button-cancel"
                                            variant="outline-danger"
                                            onClick={(e) => {e.stopPropagation(); deleteLinkedHut(p)}}
                                        >
                                            Cancel
                                        </Button>
                                    </Col>


                                </ButtonGroup>
                            </Popup>
                        </Marker>
                        )
                    }) : null}

                    {!props.gpxFile && !props.hiker ?
                        <>
                            <MapHandler currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} positions={positions}></MapHandler>
                            <SelectedMarkers currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></SelectedMarkers>
                        </>
                        : null}
                    <MyComponent></MyComponent>
                    {<GeoJSON data={map}></GeoJSON>}
                </MapContainer>
                : null}
            <a target="_blank" href="https://icons8.com/icon/HrlntWrGhszB/map-marker">Map Marker</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

            </>
        )
    } else {

        return (
            <Container >
                <MapContainer
                    className="leaflet-container"
                    center={[42.715, 12.437]} //Center somewhere random as default
                    zoom={5}
                    scrollWheelZoom={true}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {props.filter ? props.hikes.map(p => {

                        return (
                            <>
                                <Marker key={ crypto.getRandomValues(array)} icon={greenMarker}  position={{ lat: p.start_point_coordinates.split(',')[0], lng: p.start_point_coordinates.split(',')[1] }}>
                                    <Popup closeOnClick={false}>
                                        {p.start_point_address}
                                    </Popup>
                                </Marker>
                                <Marker key={ crypto.getRandomValues(array)} icon={redMarker}  position={{ lat: p.end_point_coordinates.split(',')[0], lng: p.end_point_coordinates.split(',')[1] }}>
                                    <Popup closeOnClick={false}>
                                        {p.end_point_address}
                                    </Popup>
                                </Marker>
                            </>
                        )
                    })
                        : ''}
                    {!props.clicked ? <MapHandler currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} generic={props.generic}></MapHandler> : ''}
                    {props.filter ? <SelectedMarkers currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers} radiusMin={props.radiusMin} radiusMax={props.radiusMax}></SelectedMarkers> :
                        <SelectedMarkers currentMarkers={props.currentMarkers} setCurrentMarkers={props.setCurrentMarkers}></SelectedMarkers>}
                </MapContainer>
                <a target="_blank" href="https://icons8.com/icon/HrlntWrGhszB/map-marker">Map Marker</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
            </Container>
        )
    }

}

function MapHandler(props) { //Handles just the clicks on the map
    const map = useMap()
    const click = useRef(false)
    map.on('popupopen', function(){click.current=true})
    map.on('popupclose', function(){click.current=false})
    //The above instruction are used to not trigger the map when a popup is opened
    useMapEvents({
        click: (e) => {
            if(!click.current){
                $.getJSON('https://nominatim.openstreetmap.org/reverse?lat=' + e.latlng.lat + '&lon=' + e.latlng.lng + '&format=json&limit=1', function (data) {
                    let newSelectedMarker = {}
                    if (!props.generic) {
                        let point = refDistance(e.latlng, props.positions)
                        if(point.lat && point.lng)
                            newSelectedMarker = { nameLocation:data.display_name.split(',')[0], latlng: {lat: point.lat, lng:point.lng}, altitude: point.alt, address: data.display_name }
                        else
                            alert('The point is too far from the track')
                    }
                    else {
                        newSelectedMarker = { latlng: e.latlng, address: data.display_name }
                    }
                    if ( newSelectedMarker.latlng==null ){
                        console.log("Invalid point")
                    }
                    else if (!props.currentMarkers.find(p => p.address == newSelectedMarker.address && p.latlng.lng == newSelectedMarker.latlng.lng && p.latlng.lat == newSelectedMarker.latlng.lat)) {
                        let newSelectedMarkers = [...props.currentMarkers, newSelectedMarker]
                        props.setCurrentMarkers(newSelectedMarkers)
                    } else {
                        console.log("Location already selected")
                    }
                })
        }},
    })
    return null
}
function SelectedMarkers(props) {
    return (
        <>
            {props.currentMarkers.length > 0 ? props.currentMarkers.map(p => {

                return (
                    <LayerGroup>
                        <Marker icon={refPoints} key={ crypto.getRandomValues(array)} position={p.latlng}
                            eventHandlers={{
                                click: (e) => {
                                    console.log("CLICKERD")
                                    let newSelectedMarkers = props.currentMarkers.filter(m => m.address != p.address || (m.latlng.lat != p.latlng.lat && m.latlng.lng != p.latlng.lng));
                                    props.setCurrentMarkers(newSelectedMarkers);
                                    console.log(props.currentMarkers)
                                }
                            }}
                        >
                            {
                                <Popup>
                                    {p.address}
                                </Popup>
                            }
                        </Marker>
                        {props.radiusMax || props.radiusMin ?
                            <>
                                <Circle key={'RadiusMax'} center={p.latlng} fillColor="green" radius={props.radiusMax * 1000} />
                                <Circle key={'RadiusMin'} center={p.latlng} fillColor="red" radius={props.radiusMin * 1000} />
                            </>
                            : null}

                    </LayerGroup>

                )
            })
                : ''}
        </>
    );

}


export { HikePage, GenericMap };
