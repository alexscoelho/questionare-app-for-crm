import React, { useContext, useState } from "react";
import "./Login.scss";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";

import { Form, Button, Container, Row, Col } from "react-bootstrap";

export const Login = () => {
	const { store, actions } = useContext(Context);
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [formStatus, setFormStatus] = useState({ status: "idle", message: "Log in" });
	const history = useHistory();
	if (store && store.token) history.push("/");
	return (
		<Container className="login-form">
			<Row className="justify-content-md-center">
				<Col md={6}>
					{formStatus.status == "error" &&
						formStatus.message && <div className="alert alert-danger">{formStatus.message}</div>}
					<Form
						onSubmit={e => {
							e.preventDefault();
							setFormStatus({ status: "loading", message: "Loading" });
							actions
								.login(formData)
								.catch(err => setFormStatus({ status: "error", message: err.message }));
						}}>
						<Form.Group controlId="formBasicEmail">
							<Form.Control
								type="email"
								placeholder="Email"
								onChange={e => setFormData({ ...formData, email: e.target.value })}
							/>
						</Form.Group>
						<Form.Group controlId="formBasicPassword">
							<Form.Control
								type="password"
								placeholder="Password"
								onChange={e => setFormData({ ...formData, password: e.target.value })}
							/>
						</Form.Group>
						<Button
							disabled={!["idle", "error"].includes(formStatus.status)}
							variant="primary"
							type="submit"
							block>
							{formStatus.message}
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};
