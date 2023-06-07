import { Card, Row, Col } from "react-bootstrap";
import React from 'react';

function PointCard(props) {
    return(
        <Card className ="text-center me-2 my-1  " border="primary" style={{ width: '18rem' }}>
            <Card.Header as="h5"><strong>{props.point.nameLocation ? 
                props.point.nameLocation :
                'Not specified'
            }</strong></Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Card.Text><strong>Address:</strong><br></br> {props.point.address}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card.Text><strong>GPS Coordinates: </strong><br></br> [{props.point.gps_coordinates}]</Card.Text>
                    </Col>
                </Row>
                <Row>
                    {props.point.type ? <Col><Card.Text><strong>Type:</strong><br></br> {props.point.type}</Card.Text></Col>
                    :''}
                    {props.point.capacity ? <Col><Card.Text><strong>Capacity:</strong><br></br> {props.point.capacity}{props.point.capacity==1?' person': ' people'}</Card.Text></Col>
                    :''}
                </Row>
                <Row>
                    {props.point.altitude ? <Col><Card.Text><strong>Altitude:</strong><br></br> {props.point.altitude} msnm</Card.Text></Col>
                    :''}
                </Row>
            </Card.Body>
        </Card>
    );
}

function PointsContainer(props){
    const points = props.points;
    return(
        <div className="d-flex justify-content-start flex-wrap">
            {points.length != 0 ? points.map((p) => {return(<PointCard key={p.idPoint} point={p}/>)}) : <h3>No result found</h3>}
        </div>
    );
}

export {PointsContainer};