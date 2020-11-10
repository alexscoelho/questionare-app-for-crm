import React, { useContext, useState } from "react";
import "./Dashboard.scss";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";

import { Container, Alert, Col, Row } from "react-bootstrap/";

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	const [alertData, setAlertData] = useState({});
	const alerts = [
		{ message: `You pre-scheduled interviews`, link: "Next Interview", callTo: "scheduled" },
		{ message: `You have ${3} pending interviews`, link: "Next Interview", callTo: "new" },
		{ message: `${3} candidates processed`, link: "Review", callTo: "contactList" },
		{ message: `You have ${3} interviews started but not finished`, link: "Finish Now", callTo: "incomplete" }
	];
	console.log("currentcontact:", store.currentContact);
	const handleClick = alert => {
		setAlertData({ ...alertData, selected: alert.callTo });
		if (alert.callTo === "new") actions.redirectNextInterview(history);
		if (alert.callTo === "incomplete")
			actions.getNextInterviews({ status: "DRAFT" }).then(interview => {
				if (interview.status === "DRAFT") history.push(`/contact/${store.currentContact.id}/interview/${id}`);
			});
	};
	return (
		<Container fluid>
			<h1>Agent: Bob Dylan</h1>
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
