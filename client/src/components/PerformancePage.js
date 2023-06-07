import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';


function PerformancePage(props) {
    const [duration, setDuration] = useState(0)
    const [altitude, setAltitude] = useState(0)
    const [difficulty, setDifficulty] = useState('')
    const [length, setLength] = useState(0)
    const [performanceProfile, setPerformanceProfile] = useState(false)

    //const [errorMsg, setErrorMsg] = useState("");

    const resetState = () => {
        setDuration(0); setAltitude(0);
        setDifficulty(''); setLength(0);
    }

    const submitPerformanceForm = (event) => {
        event.preventDefault();
        let newPerformance;

        newPerformance = {
            altitude: altitude, duration: duration, difficulty: difficulty, length: length
        }
        console.log(newPerformance)
        //call to the API
        alert('Performance correctly updated!')
    }


    return (<>
        {/*errorMsg ? (<Alert variant="danger" onClose={() => { setErrorMsg(""); }} dismissible> {errorMsg}</Alert>) : (false)*/}

        <Form id='performanceForm' onSubmit={submitPerformanceForm} style={{ fontSize: 15, fontWeight: 'bold' }}>

            <Row>
                <Form.Label style={{ fontSize: 25 }}>Performance Page</Form.Label>
            </Row>
            <Row>
                <Form.Group as={Col}>
                    <Form.Label>Length</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text><i className="bi bi-map"></i></InputGroup.Text>
                        <Form.Control value={length} required={true} onChange={(ev) => setLength(ev.target.value)} />
                        <InputGroup.Text>Km</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Altitude</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text><i className="bi bi-geo-fill"></i></InputGroup.Text>
                        <Form.Control value={altitude} required={true} onChange={(ev) => setAltitude(ev.target.value)} />
                        <InputGroup.Text>m</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
            </Row>

            <Row>
                <Form.Group as={Col}>
                    <Form.Label>Duration</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text><i className="bi bi-stopwatch"></i></InputGroup.Text>
                        <Form.Control 
                            type='number'
                            min='1'
                            value={duration} 
                            required={true} 
                            onChange={(ev) => setDuration(ev.target.value)} />
                        <InputGroup.Text>h</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Difficulty</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text><i className="bi bi-graph-up-arrow"></i></InputGroup.Text>
                        <Form.Select required={true} value={difficulty} onChange={(ev) => setDifficulty(ev.target.value)}>
                            <option label=''></option>
                            <option value='Tourist' label="Tourist" />
                            <option value='Hiker' label="Hiker" />
                            <option value='Professional hiker' label="Professional Hiker" />
                        </Form.Select>
                    </InputGroup>
                </Form.Group>
            </Row>

            <div>
                <Button className='mt-y' type='submit'>Save</Button>
                <Button onClick={resetState} className='ms-2 my-2'>Cancel</Button>
            </div>
        </Form>
    </>
    );
}

export { PerformancePage };