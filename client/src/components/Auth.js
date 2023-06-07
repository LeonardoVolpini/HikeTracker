import { React, useState } from 'react';
import { Form, Button, Alert, Col, Row} from 'react-bootstrap';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // if user has been redirected here from another page, go back to that urls
  const oldPath = location?.state?.pathname || "";


  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    setErrorMessage('');

    if (username.trim() === '') {
      setErrorMessage('Email cannot be empty.');
      return;
    }
    if (password === '') {                              //password can be formed by only spaces 
      setErrorMessage('Password cannot be empty.');
      return;
    }

    props.login(credentials)
      .then(() => navigate(oldPath));

  };

  const cancel=()=>{
    navigate('/');
  }

  return (
    <Row className="vh-100 justify-content-md-center my-5">
      <Col md={4} >
        {errorMessage ? (
          <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
            {errorMessage}
          </Alert>
        ) : (
          false
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={username} placeholder="Example: john.doe@polito.it"
              onChange={(ev) => setUsername(ev.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} placeholder="Enter the password."
              onChange={(ev) => setPassword(ev.target.value)}
              required={true} //minLength={6}
            />
          </Form.Group>
          <Button className="mt-3 me-3" type="submit">Login</Button>
          <Button className="mt-3" onClick={cancel}>Cancel</Button>
          <Link to='/register'>
          <Button variant='success' className='mt-3 ms-3'>Don't you have account? Get one now </Button>
        </Link>
        </Form>
      </Col>
    </Row>
  )
};

function LogoutButton(props) {
  return (
    <>
    <Button variant="outline-light" floating='right' onClick={props.logout}>Logout</Button>
    <ToastContainer />
    </>
  )
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <>
    <Button variant="outline-light" floating='right' onClick={() => navigate('/login')}>Login</Button>
    <ToastContainer />
    </>
  )
}

export { LoginForm, LogoutButton, LoginButton };