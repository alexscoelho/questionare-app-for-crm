import React from "react";
import "./CandidateList.scss";

import { Container, Row, Col, Button } from "react-bootstrap/";

export const CandidateList = () => {
	return (
		<Container fluid>
			<h1>Interviewed candidates</h1>
			<Row>
				<Col md={8} />
				<Col md={4}>{/* <Button>Interview status</Button> */}</Col>
			</Row>
		</Container>
	);
};
