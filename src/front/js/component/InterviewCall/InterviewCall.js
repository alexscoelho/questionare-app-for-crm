import React from "react";
import "./InterviewCall.scss";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";
import { InformationCard } from "../InformationCard/InformationCard.js";
import { Question } from "../Question/Question.js";

export const InterviewCall = () => {
	return (
		<Container fluid>
			<Row>
				<Col md={8}>
					<Form>
						<Question />
					</Form>
				</Col>
				<Col md={4}>
					<InformationCard />
				</Col>
			</Row>
		</Container>
	);
};
