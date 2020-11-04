import React from "react";
import "./Login.scss";

import { Form, Button, Container, Row, Col } from "react-bootstrap/";

export const Login = () => {
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
						<Button variant="primary" type="submit" block>
							Login
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};
