import React, { useContext } from "react";
import "./Login.scss";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";

import { Form, Button, Container, Row, Col } from "react-bootstrap/";

export const Login = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	if (store && store.agent) history.push("/");
	return (
		<Container className="login-form">
			<Row className="justify-content-md-center">
				<Col md={6}>
					<Form>
						<Form.Group controlId="formBasicEmail">
							<Form.Control type="email" placeholder="Email" />
						</Form.Group>
						<Form.Group controlId="formBasicPassword">
							<Form.Control type="password" placeholder="Password" />
						</Form.Group>
						<Button onClick={() => actions.login()} variant="primary" type="submit" block>
							Login
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};
