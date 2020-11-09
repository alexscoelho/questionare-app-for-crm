import React, { useContext, useEffect, useState } from "react";
import "./CommunicationStatus.scss";
import { useHistory, useParams } from "react-router-dom";
import { Context } from "../../store/appContext";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";
import { InformationCard } from "../InformationCard/InformationCard.js";

export const CommunicationStatus = () => {
	const { store, actions } = useContext(Context);
	const [formData, setFormData] = useState({});
	const history = useHistory();
	const params = useParams();
	const buttonMessages = [
		{ label: "No answer", value: "no_answer" },
		{ label: "Answered but not available", value: "no_available" },
		{ label: "Not interested anymore", value: "no_interested" },
		{ label: "Start the interview right now", value: "start_interview" }
	];
	const [showTextArea, setShowTextArea] = useState(false);

	const submitHandler = () => {
		if (formData.selected === "start_interview") {
			actions.startInterview(history);
		} else if (
			formData.selected === "no_answer" ||
			formData.selected === "no_available" ||
			formData.selected === "no_interested"
		) {
			actions.updateContact(store.currentContact.id, {
				communication_status: formData.selected
			});
		}
	};
	const handleClick = button => {
		setFormData({ ...formData, selected: button.value });
		setShowTextArea(true);
	};

	return (
		<Container fluid>
			<Row>
				<Col md={8}>
					<p>Please take some time to call the candidate and let us know.</p>
					<h1>What happened?</h1>

					<Form.Group controlId="formBasicEmail">
						{buttonMessages.map((button, index) => {
							return (
								<Button
									onClick={() => handleClick(button)}
									key="index"
									variant="light"
									style={{
										margin: 5,
										backgroundColor: button.value === formData.selected ? "blue" : undefined
									}}>
									{button.label}
								</Button>
							);
						})}
					</Form.Group>
					{showTextArea && (
						<>
							<Form.Group controlId="formBasicEmail">
								<Form.Control as="textarea" rows={3} />
							</Form.Group>

							<Form.Group controlId="formBasicEmail">
								<Button onClick={submitHandler} variant="primary" type="submit" block>
									Continue
								</Button>
							</Form.Group>
						</>
					)}
				</Col>
				<Col md={4}>
					<InformationCard contact={store.currentContact} />
				</Col>
			</Row>
		</Container>
	);
};
