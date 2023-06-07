import React, {useState} from 'react'
import {Form, Container, Row, Button} from 'react-bootstrap'


/*
THIS COMPONENT IS JUST TEMPORARY, IT'S A SIMPLE FORM TO UPLOAD A FILE AND READ IT.
THE CONTENT OF THE FILE IS CONTAINED IN reader.result, WE SHOULD GIVE THIS STRING
AT THE GPX PARSE TO HAVE THE TRACKS POINT FOR THE MAP
*/
const FileUploader = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleSubmit = (event) => {

        let reader = new FileReader();
      
        reader.readAsText(selectedFile);
      
        reader.onload = function() {
          console.log(reader.result);
        };
      
        reader.onerror = function() {
          console.log(reader.error);
        };

        event.preventDefault();
    }


    return (
        
        <Container className="mt-5">
            <Row className="mt-5">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile" className="mt-5">
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </Form.Group>
                <Button className ="mt-3 ms-1" type='submit'>Import</Button>
                </Form>
            </Row>

        </Container>
    )

}
export default FileUploader;