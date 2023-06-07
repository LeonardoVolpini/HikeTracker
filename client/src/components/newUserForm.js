import { Button, Alert, Form, DropdownButton, Dropdown, Col, Row } from "react-bootstrap";
import { useState, React } from "react";
import { useNavigate } from 'react-router-dom';

function UserForm(props) {
	const reg = '^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{1,3}$';
	const [name, setName] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cPassword, setCPassword] = useState("");
	const [role, setRole] = useState("Hiker");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [code, setCode] = useState('');
	const [dbcode, setDBCode] = useState('');
	const [group1, setGroup1] = useState('block');
	const [group2, setGroup2] = useState('none');
	const [errorMsg, setErrorMsg] = useState(""); // empty string '' = no error
	const [state, setState] = useState({
		time: 10,
		btnDisable: false,
		btnContent: 'Send again'
	});
	const navigate = useNavigate();
	const [value, setvalue] = useState("");
	const handleDropdown = e => {
		setvalue(e.target.name);
		setRole(e.target.name);

	};


	const handleSubmit = (event) => {
		event.preventDefault();
		props.checkCode(email).then((result) => {
			setDBCode(result);
		})
		props.checkUser(email).then((result) => {
			console.log(dbcode);
			let newUser = undefined;
			// validation
			if (!result) {
				setErrorMsg("This email has already been used.");
				return;
			}

			if (cPassword !== password) {
				setErrorMsg("The password does not match.");
				return;
			}

			if (code != '' && code == dbcode) {
				newUser = { name: name, lastname: lastname, email: email, password: password, role: role, phoneNumber: phoneNumber };
			} else {
				setErrorMsg("Verification code is wrong.");
				return;
			}
			if(role=='Hiker'){
			props.CreateNewAccount(newUser);
			alert('New user registration succeeded');
			navigate('/login');
			}
			else{
				alert('You information has being sent to the manager!');
				alert('You will receive a email after your information been verified');
				navigate('/');
			}
		});
	};

	const cancel = () => {
		navigate('/');
	}


	let timeChange;
	let ti = state.time;
	const clock = () => {
		if (ti > 0) {
			ti = ti - 1;
			setState({
				btnDisable: true,
				time: ti,
				btnContent: "Can't send again in " + ti + " s",
			});
			console.log(ti);
		} else {
			clearInterval(timeChange);
			setState({
				btnDisable: false,
				time: 10,
				btnContent: "Send again",
			});
		}
	};

	const again = () => {
		let newUser = { name: name, lastname: lastname, email: email, password: password, role: role, phoneNumber: phoneNumber };
		props.sendEmail(email,newUser);
		props.checkCode(email).then((result) => {
			setDBCode(result);
		})
		setState({
			btnDisable: true,
			btnContent: "Can't send again in 10 s",
		});
		timeChange = setInterval(clock, 1000);
	};

	const sendCode = (event) => {
		event.preventDefault();

		if (email !== '') {
			props.checkUser(email).then((result) => {
				if (result) {
					setGroup1('none');
					setGroup2('block');
					let newUser = { name: name, lastname: lastname, email: email, password: password, role: role, phoneNumber: phoneNumber };
					
					props.sendEmail(email,newUser);
					props.checkCode(email).then((result) => {
						setDBCode(result);
					})
					alert('The verification code has been sent to your email');
				} else {
					setErrorMsg("This email has been registered.");
				}
			})
		}
		else {
			setErrorMsg("Email cannot be empty.");
		}

	}

	return (
		<Row className="vh-100 justify-content-md-center">
			<Col md={4} >
				<h1 className="pb-5">Register</h1>
				{errorMsg ? (
					<Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>
						{errorMsg}
					</Alert>
				) : (
					false
				)}
				<Form onSubmit={handleSubmit}>
					<Form.Group style={{ display: group1 }}>
						<Form.Label>Name</Form.Label>
						<Form.Control
							value={name} placeholder="Enter your name."
							onChange={(ev) => setName(ev.target.value)}
							required={true}
						></Form.Control>
					</Form.Group>
					<Form.Group style={{ display: group1 }}>
						<Form.Label>Lastname</Form.Label>
						<Form.Control
							value={lastname} placeholder="Enter your lastname."
							onChange={(ev) => setLastname(ev.target.value)}
							required={true}
						></Form.Control>
					</Form.Group >
					<Form.Group style={{ display: group1 }} className='dropdown'>
						<DropdownButton className="my-2" title={value === "" ? "Select Your Role" : value} value={role} onChange={event => { setRole(event.target.title); }}
						>
							<Dropdown.Item name="Hiker" onClick={e => handleDropdown(e)} >
								Hiker
							</Dropdown.Item>
							<Dropdown.Item name="HutWorker" onClick={e => handleDropdown(e)} >
								HutWorker
							</Dropdown.Item>
							<Dropdown.Item name="LocalGuide" onClick={e => handleDropdown(e)} >
								LocalGuide
							</Dropdown.Item>
						</DropdownButton>
					</Form.Group>
					<Form.Group style={{ display: group1 }}>
						<Form.Label>Email</Form.Label>
						<Form.Control
							value={email} placeholder="Enter your Email."
							onChange={(ev) => setEmail(ev.target.value)} required={true} pattern={reg}
						></Form.Control>
					</Form.Group>
					<Form.Group style={{ display: group1 }}>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							value={password} placeholder="Enter the password."
							onChange={(ev) => setPassword(ev.target.value)}
							required={true} //minLength={6}
						></Form.Control>
					</Form.Group>
					<Form.Group style={{ display: group1 }}>
						<Form.Label>Confirm Your Password</Form.Label>
						<Form.Control
							type="password"
							value={cPassword} placeholder="Enter the password."
							onChange={(ev) => setCPassword(ev.target.value)}
							required={true}
						></Form.Control>
					</Form.Group>
					<Form.Group style={{ display: group1 }}>
						<Form.Label>Phone number</Form.Label>
						<Form.Control
							value={phoneNumber} placeholder="Enter the phone number."
							onChange={(ev) => setPhoneNumber(ev.target.value)}
							required={true}
						></Form.Control>
					</Form.Group>
					<Form.Group style={{ display: group2 }}>
						<Form.Label>Verification Code</Form.Label>
						<Form.Control
							value={code} placeholder="Enter the verification code."
							onChange={(ev) => setCode(ev.target.value)}
							required={true}
						></Form.Control>
					</Form.Group>
					<Button style={{ display: group2 }} className='mt-3' type='submit'>Save</Button>
					<Button style={{ display: group1 }} className='mt-3' onClick={sendCode}>Verify email</Button>
					<Button style={{ display: group2 }} className='mt-3' type="primary" onClick={again} disabled={state.btnDisable}>{state.btnContent}</Button>
					<Button className='mt-3 ' onClick={cancel}>Cancel</Button>

				</Form>
			</Col>
		</Row>
	);
}

export { UserForm };