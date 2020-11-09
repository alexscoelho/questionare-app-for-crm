import React, { useContext } from "react";
import "./InterviewCall.scss";
import { Context } from "../../store/appContext";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";
import { InformationCard } from "../InformationCard/InformationCard.js";
import { Question } from "../Question/Question.js";

export const InterviewCall = () => {
	const { store, actions } = useContext(Context);
	return (
		<Container fluid>
			<Row>
				<Col md={8}>
					<Form>
						<Question />
					</Form>
				</Col>
				<Col md={4}>
					<InformationCard contact={store.currentContact} />
				</Col>
			</Row>
		</Container>
	);
};
