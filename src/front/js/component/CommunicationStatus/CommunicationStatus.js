import React from "react";
import "./CommunicationStatus.scss";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";
import { InformationCard } from "../InformationCard/InformationCard.js";

export const CommunicationStatus = () => {
	const buttonMessages = [
		"No answer",
		"Answered but not available",
		"Not interested anymore",
		"Start the interview right now"
	];

	return (
		<Container fluid>
			<Row>
				<Col md={8}>
					<p>Please take some time to call the candidate and let us know.</p>
					<h1>What happened?</h1>
					<Form>
						<Form.Group controlId="formBasicEmail">
							{buttonMessages.map((button, index) => {
								return (
									<Button key="index" variant="light" style={{ margin: 5 }}>
										{button}
									</Button>
								);
							})}
						</Form.Group>
						<Form.Group controlId="formBasicEmail">
							<Form.Control as="textarea" rows={3} />
						</Form.Group>
						<Form.Group controlId="formBasicEmail">
							<Button variant="primary" type="submit" block>
								Continue
							</Button>
						</Form.Group>
					</Form>
				</Col>
				<Col md={4}>
					<InformationCard />
				</Col>
			</Row>
		</Container>
	);
};
