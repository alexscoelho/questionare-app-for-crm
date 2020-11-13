import React, { useContext, useEffect, useState } from "react";
import "./CommunicationStatus.scss";
import { useHistory, useParams } from "react-router-dom";
import { Context } from "../../store/appContext";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

import { Container, Col, Row, Alert, Button, Form } from "react-bootstrap";
import { InformationCard } from "../InformationCard/InformationCard.js";

export const CommunicationStatus = () => {
	const { store, actions } = useContext(Context);
	const [formData, setFormData] = useState({});
	const [formStatus, setFormStatus] = useState({ status: "idle", message: "" });
	const history = useHistory();
	const params = useParams();
	const buttonMessages = [
		{ label: "No answer", value: "no_answer" },
		{ label: "Answered but not available", value: "not_available" },
		{ label: "Not interested anymore", value: "not_interested" },
		{ label: "Start the interview right now", value: "start_interview" },
		{ label: "Re-schedule Interview", value: "schedule_interview" }
	];
	const [showTextArea, setShowTextArea] = useState(false);

	useEffect(() => {
		if (!store.currentDeal) {
			console.log("communicationStatus", store);
			actions.getDeal(params.dealId);
		}
	}, []);

	const submitHandler = () => {
		if (formData.selected === "start_interview") {
			actions.startInterview(params.dealId).catch(e => setFormStatus({ status: "danger", message: e.message }));
		} else if (
			formData.selected === "no_answer" ||
			formData.selected === "not_available" ||
			formData.selected === "not_interested"
		) {
			actions
				.updateDeal(store.currentDeal.id, {
					communication_status: formData.selected.toUpperCase()
				})
				.then(deal => history.push("/"))
				.catch(e => setFormStatus({ status: "danger", message: e.message }));
		} else if (formData.selected === "schedule_interview") {
			if (!formData.dateTime) setFormStatus({ status: "danger", message: "Please pick the schedule date" });
			else
				actions
					.startInterview(params.dealId, formData)
					.catch(e => setFormStatus({ status: "danger", message: e.message }));
		}
	};
	const handleClick = button => {
		setFormStatus({ status: "idle", message: "Continue" });
		setFormData({ ...formData, selected: button.value });
		setShowTextArea(true);
	};

	const pickDate = formData => {
		if (formData.selected === "schedule_interview")
			return (
				<>
					<Datetime
						inputProps={{ placeholder: "Pick a time and date" }}
						displayTimeZone={store.agent.time_zone}
						utc
						onChange={dateTime => setFormData({ ...formData, dateTime })}
					/>
				</>
			);
	};
	if (!store.currentDeal) return "Loading...";
	return (
		<Container fluid>
			<Row>
				<Col md={8}>
					<Alert variant="info">
						<h1>Please take some time to call the candidate and let us know.</h1>
					</Alert>
					<h2>What happened?</h2>
					<Form.Group controlId="formBasicEmail">
						{buttonMessages.map((button, index) => {
							return (
								<Button
									onClick={() => handleClick(button)}
									key={index}
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
								{formStatus.status == "danger" && <Alert variant="danger">{formStatus.message}</Alert>}
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
