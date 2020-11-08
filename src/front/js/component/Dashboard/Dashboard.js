import React, { useContext } from "react";
import "./Dashboard.scss";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";

import { Container, Alert, Col, Row } from "react-bootstrap/";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	console.log(history);
	return (
		<Container fluid>
			<h1>Agent: Bob Dylan</h1>
			<Alert variant="light" className="event-message">
				<Row>
					<Col>You have 34 pending interviews </Col>
					<Col md={3}>
						<Alert.Link onClick={() => actions.redirectNextInterview(history)}>
							Next interview <i className="far fa-arrow-alt-circle-right" />
						</Alert.Link>
					</Col>
				</Row>
			</Alert>
		</Container>
	);
};
