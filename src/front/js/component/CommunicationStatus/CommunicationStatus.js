import React, { useContext, useEffect, useState } from "react";
import "./CommunicationStatus.scss";
import { useHistory, useParams } from "react-router-dom";
import { Context } from "../../store/appContext";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

import { Container, Col, Row, Card, Button, Form, Alert } from "react-bootstrap/";
import { InformationCard } from "../InformationCard/InformationCard.js";

export const CommunicationStatus = () => {
	const { store, actions } = useContext(Context);
	const [formData, setFormData] = useState({});
	const history = useHistory();
	const params = useParams();
	const [message, setMessage] = useState({ label: "", type: "hidden" });
	const buttonMessages = [
		{ label: "No answer", value: "no_answer" },
		{ label: "Answered but not available", value: "no_available" },
		{ label: "Not interested anymore", value: "no_interested" },
		{ label: "Start the interview right now", value: "start_interview" },
		{ label: "Re-schedule Interview", value: "schedule_interview" }
	];
	const [showTextArea, setShowTextArea] = useState(false);

	// useEffect(() => {

	// 	if (!store.interview) {
	// 		console.log("Test2");
	// 		actions.getInterview(31);
	// 	}
	// }, []);

	const submitHandler = () => {
		if (formData.selected === "start_interview") {
			actions
				.startInterview(history, params)
				.catch(error => setMessage({ label: "Unable to submit the interview", type: "danger" }));
		} else if (
			formData.selected === "no_answer" ||
			formData.selected === "no_available" ||
			formData.selected === "no_interested"
		) {
			actions.updateDeal(store.currentDeal.id, {
				communication_status: formData.selected
			});
		} else if (formData.selected === "schedule_interview") {
			actions.startInterview(history, params, formData);
		}
	};
	const handleClick = button => {
		setFormData({ ...formData, selected: button.value });
		setShowTextArea(true);
	};

	const pickDate = formData => {
		if (formData.selected === "schedule_interview")
			return (
				<>
					<label htmlFor="schedule">Pick a time and date</label>
					<Datetime
						displayTimeZone={store.agent.time_zone}
						utc
						onChange={dateTime => setFormData({ ...formData, dateTime })}
					/>
				</>
			);
	};

	return (
		<Container fluid>
			{message.type != "hidden" && (
				<Alert variant={message.type} className="event-message fixed-alert">
					{message.label}
				</Alert>
			)}
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
							{pickDate(formData)}
							<Form.Group controlId="formBasicEmail">
								<Form.Control as="textarea" rows={3} placeholder="Commets..." />
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
					<InformationCard deal={store.currentDeal} />
				</Col>
			</Row>
		</Container>
	);
};
