import { useState, React, useEffect } from "react";
import { Form, Button, Row, Col} from "react-bootstrap";
import MultiRangeSlider from "multi-range-slider-react";
import '../App.css';
import { GenericMap } from "./hikePage";

const FilterForm = (props) => {

    const [minLength, setminLength] = useState(0)
    const [maxLength, setmaxLength] = useState(20)
    const [etMin, setETmin] = useState(0)
    const [etMax, setETmax] = useState(5)
    const [ascentMin, setAscentMin] = useState(0)
    const [ascentMax, setAscentMax] = useState(1000)
    const [difficulty, setDifficulty] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [region, setRegion] = useState('')
    const [distanceMin, setDistanceMin] = useState(0)
    const [distanceMax, setDistanceMax] = useState(5)
    const [filterLength,setFilterLength] = useState(false)
    const [filterET,setFilterET] = useState(false)
    const [filterAscent,setFilterAscent] = useState(false)
    const [filterDistance,setFilterDistance] = useState(false)
    const [point, setPoint] = useState([])
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
		if (point.length != 0) {
			setClicked(true)
		}
		else {
			setClicked(false)
		}
	}, [point]);

    function reset(){
        setminLength(0); setmaxLength(20);
        setETmin(0); setETmax(5); 
        setAscentMin(0); setAscentMax(1000); 
        setDifficulty(''); setCity('');
        setProvince(''); setRegion('');
        
    }

    function handleSubmit(event) {

        event.preventDefault();

        const $ = require( "jquery" );
        let filteredHikes = ''
        const filter = {city: city, region: region, province:province, length: {min : minLength, max: maxLength}, expected_time: {min: etMin, max: etMax}, ascent: {min : ascentMin, max: ascentMax},
        difficulty: difficulty, distance: {point: point, min: distanceMin, max: distanceMax}}
        props.setLoading(true)
        if(filter.city || filter.region || filter.province){
            let str = "https://nominatim.openstreetmap.org/search?format=json&limit=1&city="+filter.city +"&county="+filter.province+"&state="+filter.region
            $.getJSON(str
            , function(data) {
                if(data.length!= 0){
                    $.each(data, function(key, val) {
                        filteredHikes = props.hikes.filter( (hike) =>{
                            let bool = true
                            if( filter.length && filterLength){
                                let key = 'length'
                                console.log(hike[key])
                                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                                    bool = false;
                            }
                            if(filter.expected_time && filterET){
                                let key = 'expected_time'
                                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                                    bool = false;
                            }
                            if(filter.ascent && filterAscent){
                                let key = 'ascent'
                                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                                    bool = false;
                            }
                            if(filter.difficulty)
                                if(hike['difficulty']!=filter['difficulty'])
                                    bool = false;
                            if(filterDistance && filter.distance.point.length != 0){
                                let found = filter.distance.point[0].distHikes.find(x=> x.hike == hike)
                                if(found != undefined && !(found.minDist >= filter.distance.min && found.minDist <= filter.distance.max))
                                    bool = false
                            }
                            if(bool){
                                if(filter.city||filter.province||filter.region){

                                    let values = val.display_name.split(',')
                                    console.log(values)
                                    if(filter.city)
                                        bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(values[0].trim())
                                    console.log(bool)
                                    if(filter.province && bool){
                                        bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[1].trim() : values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[1].trim() : values[0].trim())
                                    }
        
                                    if(filter.region && bool)
                                        bool = (hike.start_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[2].trim() : filter.province ? values[1].trim() : values[0].trim())  || (hike.end_point_address.split(',').map((v)=>v.trim())).includes(filter.city ? values[2].trim() : filter.province ? values[1].trim() : values[0].trim())   
                                }
                            }
    
                            return bool
                            
                        }
                        )
                        props.setFilteredHikes(filteredHikes)
                        props.setLoading(false)

                    })
                }else{
                    props.setFilteredHikes(filteredHikes)
                    props.setLoading(false)
                }            
            })

        }
        else{
            filteredHikes = props.hikes.filter( (hike) =>{
                
            let bool = true
            if( filter.length && filterLength){
                let key = 'length'
                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                    bool = false;
            }
            if(filter.expected_time && filterET){
                let key = 'expected_time'
                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                    bool = false;
            }
            if(filter.ascent && filterAscent){
                let key = 'ascent'
                if(!(hike[key] >= filter[key].min && hike[key]<= filter[key].max) )
                    bool = false;
            }
            if(filter.difficulty)
                if(hike['difficulty']!=filter['difficulty'])
                    bool = false;
            if(filterDistance && filter.distance.point.length != 0){
                let found = filter.distance.point[0].distHikes.find(x=> x.hike == hike)
                if(found != undefined && !(found.minDist >= filter.distance.min && found.minDist <= filter.distance.max))
                    bool = false
            }
            return bool
                
            }
            )
            props.setFilteredHikes(filteredHikes)
            props.setLoading(false)  

        }
        props.setFiltered(true)  
        props.setHidden(true)

        reset()
    }

    function changeCity(event){
        setCity(event.target.value)
    }

    function changeProvince(event){
        setProvince(event.target.value)
    }

    function changeRegion(event){
        setRegion(event.target.value)
    }

    function changeDifficulty(event){
        setDifficulty(event.target.value)
    }

    function lengthFilterBool(){
        setFilterLength(!filterLength)
    }

    function ETfilterBool(){
        setFilterET(!filterET)
    }

    function ascentFilterBool(){
        setFilterAscent(!filterAscent)
    }

    function distanceFilterBool(){
        setFilterDistance(!filterDistance)
    }

    function changeMinMaxLength(event){
        setminLength(event.minValue)
        setmaxLength(event.maxValue)
    }

    function changeMinLength(event){
        setminLength(event.target.value)
    }

    function changeMaxLength(event){
        setmaxLength(event.target.value)
    }

    function changeMinMaxET(event){
        setETmin(event.minValue)
        setETmax(event.maxValue)
    }

    function changeMinET(event){
        setETmin(event.target.value)
    }

    function changeMaxET(event){
        setETmax(event.target.value)
    }

    function changeMinMaxAscent(event){
        setAscentMin(event.minValue)
        setAscentMax(event.maxValue)
    }

    function changeMinAscent(event){
        setAscentMin(event.target.value)
    }

    function changeMaxAscent(event){
        setAscentMax(event.target.value)
    }

    function changeMinMaxDistance(event){
        setDistanceMin(event.minValue)
        setDistanceMax(event.maxValue)
    }

    function changeMinDistance(event){
        setDistanceMin(event.target.value)
    }

    function changeMaxDistance(event){
        setDistanceMax(event.target.value)
    }

    function hideFilters(){
        props.setHidden(true)
    }

      return (
        <>
        <Form  className="border border-primary rounded d-flex justify-content-center flex-wrap" onSubmit={handleSubmit}>


            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>City</Form.Label>
                <Form.Control type="text" required={false} value={city} placeholder = {'Turin'} onChange={changeCity}/>
            </Form.Group>


            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>Province</Form.Label>
                <Form.Control type="text" required={false} value={province} placeholder = {'Turin'} onChange={changeProvince}/>
            </Form.Group>


            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>Region</Form.Label>
                <Form.Control type="text" required={false} value={region} placeholder = {'Piedmont'} onChange={changeRegion}/>
            </Form.Group>   

            <Form.Group className="my-2 px-1" style={{ width: 'maxWidth' }}>
                <Form.Label>Difficulty</Form.Label>
                    <Form.Select onChange={changeDifficulty}>
                        <option label=''></option>
                        <option value='Tourist'  label="Tourist"/>
                        <option value='Hiker' label="Hiker"/>
                        <option value='Professional hiker' label="Professional Hiker"/>
                    </Form.Select>
            </Form.Group>
            <Col className="px-3">
                <Row>
                    <Form.Group className="my-2">
                        <Form.Check type="checkbox" label="Filter by Lenght" onChange={lengthFilterBool}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="my-2">
                        <Form.Check type="checkbox" label="Filter by Expected Time" onChange={ETfilterBool}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="my-2 ">
                        <Form.Check type="checkbox" label="Filter by Ascent" onChange={ascentFilterBool}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="my-2 ">
                        <Form.Check type="checkbox" label="Filter by Distance" onChange={distanceFilterBool}/>
                    </Form.Group>
                </Row>
            </Col>
            <Row className="px-3">
            {filterLength ? 
                <Form.Group className="my-2" >
                    <Form.Label>Length</Form.Label>
                    <Row className="mx-2">
                        <MultiRangeSlider
                            min={0}
                            max={100}
                            step={1}
                            ruler ={false}
                            label = {true}
                            barInnerColor ={'#0091ea'}
                            style = {{border: 'none', boxShadow: 'none'}}
                            minValue={0}
                            maxValue={20}
                            minCaption = {minLength}
                            maxCaption = {maxLength}
                            onInput={changeMinMaxLength}
                        />
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>From</Form.Label>
                                <Form.Control type="number" required={false} value={minLength} placeholder = {minLength} onChange={changeMinLength}/>
                            </Form.Group>  
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>to</Form.Label>
                                <Form.Control type="number" required={false} value={maxLength} placeholder = {maxLength} onChange={changeMaxLength}/>
                            </Form.Group>  
                        </Col>
                    </Row>
                </Form.Group>   
            :null}
            {filterET ?
                <Form.Group className="my-2" >
                    <Form.Label>Expected time hours</Form.Label>
                    <Row className="mx-2">
                        <MultiRangeSlider
                            min={0}
                            max={24}
                            step={1}
                            ruler ={false}
                            label = {true}
                            barInnerColor ={'#0091ea'}
                            style = {{border: 'none', boxShadow: 'none'}}
                            minValue={etMin}
                            maxValue={etMax}
                            minCaption = {etMin}
                            maxCaption = {etMax}
                            onInput={changeMinMaxET}
                        />
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>From</Form.Label>
                                <Form.Control type="number" required={false} value={etMin} placeholder = {etMin} onChange={changeMinET}/>
                            </Form.Group>  
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>to</Form.Label>
                                <Form.Control type="number" required={false} value={etMax} placeholder = {etMax} onChange={changeMaxET}/>
                            </Form.Group>  
                        </Col>
                    </Row>
                </Form.Group>   
            : null}
            {filterAscent ?
                <Form.Group className="my-2">
                    <Form.Label>Ascent</Form.Label>
                    <Row className="mx-2">
                        <MultiRangeSlider
                            min={0}
                            max={2000}
                            step={10}
                            ruler ={false}
                            label = {true}
                            barInnerColor ={'#0091ea'}
                            style = {{border: 'none', boxShadow: 'none'}}
                            minValue={ascentMin}
                            maxValue={ascentMax}
                            minCaption = {ascentMin}
                            maxCaption = {ascentMax}
                            onInput={changeMinMaxAscent}
                        />
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>From</Form.Label>
                                <Form.Control type="number" required={false} value={ascentMin} placeholder = {ascentMin} onChange={changeMinAscent}/>
                            </Form.Group>  
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>to</Form.Label>
                                <Form.Control type="number" required={false} value={ascentMax} placeholder = {ascentMax} onChange={changeMaxAscent}/>
                            </Form.Group>  
                        </Col>
                    </Row>
                </Form.Group>
            : null}
            {filterDistance ?
                <Form.Group className="my-2">
                    <Form.Label>Range Distance</Form.Label>
                    <Row className="mx-2">
                        <MultiRangeSlider
                            min={0}
                            max={30}
                            step={1}
                            ruler ={false}
                            label = {true}
                            barInnerColor ={'#0091ea'}
                            style = {{border: 'none', boxShadow: 'none'}}
                            minValue={distanceMin}
                            maxValue={distanceMax}
                            minCaption = {distanceMin}
                            maxCaption = {distanceMax}
                            onInput={changeMinMaxDistance}
                        />
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>From</Form.Label>
                                <Form.Control type="number" required={false} value={distanceMin} placeholder = {distanceMin} onChange={changeMinDistance}/>
                            </Form.Group>  
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>to</Form.Label>
                                <Form.Control type="number" required={false} value={distanceMax} placeholder = {distanceMax} onChange={changeMaxDistance}/>
                            </Form.Group>  
                        </Col>
                    </Row>
                    <GenericMap gpxFile={''} currentHike={[]} currentMarkers = {point} setCurrentMarkers = {setPoint} clicked={clicked} generic={true} hikes = {props.hikes} radiusMin = {distanceMin} radiusMax ={distanceMax} filter={true}></GenericMap>
                </Form.Group>
            : null}
            </Row>     
            <Button className="align-self-end mb-2 ms-4" variant="primary" type="submit">Search</Button>
            <Button className="align-self-end mb-2 ms-2" variant="primary" onClick={hideFilters}>Back</Button>

    </Form>


        </>
      );
  }
  export default FilterForm;