import React, { useContext, useState } from "react";
import "./Dashboard.scss";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";

import { Container, Alert, Col, Row } from "react-bootstrap/";
import { Private } from "../Private/Private.js";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	const [alertData, setAlertData] = useState({});
	const [message, setMessage] = useState({ label: "", type: "hidden" });
	const alerts = [
		{ message: `You pre-scheduled interviews`, link: "Next Interview", callTo: "scheduled" },
		{ message: `You have ${3} pending interviews`, link: "Next Interview", callTo: "new" },
		{ message: `${3} candidates processed`, link: "Review", callTo: "dealList" },
		{ message: `You have ${3} interviews started but not finished`, link: "Finish Now", callTo: "incomplete" }
	];

	const handleClick = alert => {
		setAlertData({ ...alertData, selected: alert.callTo });
		if (alert.callTo === "new")
			actions
				.redirectNextInterview()
				.then(deal => history.push(`/deal/${deal.id}`))
				.catch(error => setMessage({ label: error.message || error, type: "danger" }));
		if (alert.callTo === "incomplete")
			actions
				.getNextInterviews({ status: "DRAFT" })
				.then(interview => {
					history.push("/pending/interviews");
				})
				.catch(error => setMessage({ label: error.message || error, type: "danger" }));

		if (alert.callTo === "dealList") history.push("/candidatelist");
	};
	return (
		<Container fluid>
			<Private />
			<h1>Agent: Bob Dylan</h1>
			{message.type != "hidden" && (
				<Alert variant={message.type} className="event-message">
					{message.label}
				</Alert>
			)}
			{alerts.map((alert, index) => {
				return (
					<Alert key={index} variant="light" className="event-message">
						<Row>
							<Col>{alert.message}</Col>
							<Col md={3}>
								<Alert.Link onClick={() => handleClick(alert)}>
									{alert.link}
									<i className="far fa-arrow-alt-circle-right" />
								</Alert.Link>
							</Col>
						</Row>
					</Alert>
				);
			})}
		</Container>
	);
};
