import 'bootstrap/dist/css/bootstrap.min.css'
import { React } from 'react';

import { Col, Table, Button } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';



function ManagerPage(props) {

  return (
    <Col sm={8} >
      <h1 className='mx-3 my-3'>Hello Manager</h1>
      <ManagerTable list={props.list} CreateNewAccount={props.CreateNewAccount} deleteReq={props.deleteReq} sendNotice1={props.sendNotice1} sendNotice2={props.sendNotice2}></ManagerTable>
    </Col>
  );
}

function ManagerTable(props) {
  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>LastName</th>
            <th>Role</th>
            <th>phoneNumber</th>
            <th>options</th>
          </tr>
        </thead>
        <tbody>
          {

            props.list.map((r) =>
              <ManagerRow req={r} key={r.email} CreateNewAccount={props.CreateNewAccount} deleteReq={props.deleteReq} sendNotice1={props.sendNotice1} sendNotice2={props.sendNotice2}></ManagerRow>)
          }
        </tbody>
      </Table>
    </>
  );
}
function ManagerRow(props) {

  return (
    <tr>
      <ManagerData key={props.req.email} CreateNewAccount={props.CreateNewAccount} deleteReq={props.deleteReq} req={props.req} sendNotice1={props.sendNotice1} sendNotice2={props.sendNotice2} />
    </tr>
  );
}
function ManagerData(props) {
  const confirm = () => {
    let newUser = { name: props.req.name, lastname: props.req.lastname, email: props.req.email, password: props.req.password, role: props.req.role, phoneNumber: props.req.phone_number }
    props.CreateNewAccount(newUser)
    alert('Account verified');
    props.sendNotice1(props.req.email);
    window.location.reload([true]);
  }

  const reject = () => {
    props.deleteReq(props.req.email);
    alert('Account reject');
    props.sendNotice2(props.req.email);
    window.location.reload([true]);
  }

  return (
    <>

      <td className="mb-2" > {props.req.email}</td>
      <td> {props.req.name}</td>



      <td > {props.req.lastname}</td>
      <td > {props.req.role}</td>
      <td > {props.req.phone_number}</td>
      <td>
        <Button variant='success' onClick={confirm}>Confirm</Button>
        <Button variant='danger' onClick={reject}>Reject</Button>
      </td>

    </>
  );
}

export { ManagerPage };