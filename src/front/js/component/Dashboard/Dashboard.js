import React from "react";
import "./Dashboard.scss";

import { Container, Alert, Col, Row } from "react-bootstrap/";

export const Dashboard = () => {
	return (
		<Container fluid>
			<h1>Agent: Bob Dylan</h1>
			<Alert variant="light" className="event-message">
				<Row>
					<Col>You have 34 pending interviews </Col>
					<Col md={3}>
						<Alert.Link href="#">
							Next interview <i className="far fa-arrow-alt-circle-right" />
						</Alert.Link>
					</Col>
				</Row>
			</Alert>
		</Container>
	);
};
