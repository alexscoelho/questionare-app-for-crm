import React, { useContext, useState } from "react";
import "./Dashboard.scss";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";

import moment from "moment";
import { Container, Alert, Col, Row, Card, Badge } from "react-bootstrap/";
import { useEffect } from "react";

const STAGES = ["PENDING", "APPROVED", "REJECTED", "NOT_INSTERESTED"];
const stage_color = {
	PENDING: "warning",
	APPROVED: "success",
	REJECTED: "danger",
	NOT_INSTERESTED: "secondary"
};
export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	const [alertData, setAlertData] = useState({});
	const [deals, setDeals] = useState({
		PENDING: [],
		APPROVED: [],
		REJECTED: [],
		NOT_INSTERESTED: []
	});
	const [interviews, setInterviews] = useState({
		PENDING: [],
		DRAFT: [],
		POSTPONED: [],
		COMPLETED: []
	});
	const [message, setMessage] = useState({ label: "", type: "hidden" });
	const steps = [
		{ message: `Scheduled interviews`, link: "View all", callTo: "scheduled", stage: "POSTPONED" },
		{ message: `Pending interviews`, link: "Start next Int.", callTo: "new", stage: "PENDING" },
		{ message: `Unfinished`, link: "View all", callTo: "incomplete", stage: "DRAFT" },
		{ message: `Finished Interviews`, link: "View All", callTo: "dealList", stage: "COMPLETED" }
	];

	const handleStepClick = alert => {
		setAlertData({ ...alertData, selected: alert.callTo });
		if (alert.callTo === "new")
			actions
				.redirectNextInterview({ status: "PENDING" })
				.then(deal => history.push(`/deal/${deal[0].deal_id}`))
				.catch(error => setMessage({ label: error.message || error, type: "danger" }));
		if (alert.callTo === "incomplete")
			actions
				.getInterviews({ status: "DRAFT" })
				.then(interview => {
					history.push("/interviews?status=DRAFT");
				})
				.catch(error => setMessage({ label: error.message || error, type: "danger" }));

		if (alert.callTo === "dealList") history.push("/deals");
	};

	useEffect(
		() => {
			if (!store.candidates) actions.getDeals();
			else if (Array.isArray(store.candidates))
				setDeals({
					PENDING: store.candidates.filter(c => c.status == "PENDING"),
					APPROVED: store.candidates.filter(c => c.status == "APPROVED"),
					REJECTED: store.candidates.filter(c => c.status == "REJECTED"),
					NOT_INSTERESTED: store.candidates.filter(c => c.status == "NOT_INSTERESTED")
				});
		},
		[store.candidates]
	);
	useEffect(
		() => {
			if (!store.interviews) actions.getInterviews();
			else if (Array.isArray(store.interviews))
				setInterviews({
					PENDING: store.candidates.filter(c => c.status == "PENDING"),
					DRAFT: store.candidates.filter(c => c.status == "DRAFT"),
					POSTPONED: store.candidates.filter(c => c.status == "POSTPONED"),
					COMPLETED: store.candidates.filter(c => c.status == "COMPLETED")
				});
		},
		[store.candidates]
	);
	return (
		<Container className="dashboard">
			{message.type != "hidden" && (
				<Alert variant={message.type} className="event-message">
					{message.label}
				</Alert>
			)}
			<h2>By deal stage: </h2>
			<Row>
				{steps.map(s => (
					<Col key={s.callTo} md={3}>
						<Card className="hovered interview-stage">
							<Card.Body className="p-1">
								<Card.Text>
									<Badge className="mr-1" variant="secondary">
										{interviews[s.stage].length}
									</Badge>
									{s.message}
								</Card.Text>
								<Card.Link onClick={() => handleStepClick(s)}>{s.link}</Card.Link>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
			<h2>By opportunity stage: </h2>
			<Row>
				{STAGES.map(status => (
					<Col key={status}>
						<h4>
							{status} <Badge variant="secondary">{deals[status].length}</Badge>
						</h4>
						{deals[status].map(deal => (
							<Card
								key={deal.id}
								className="hovered"
								onClick={() => {
									if (deal.status == "PENDING") {
										history.push(`/deal/${deal.id}`);
									}
								}}>
								<Card.Body className="p-1">
									<Card.Title>
										{deal.contact.first_name} {deal.contact.last_name}
									</Card.Title>
									<Card.Subtitle className="mb-2 text-muted small">
										{deal.contacted_at
											? `last contacted at: ${moment(deal.contacted_at).fromNow()}`
											: "never contacted"}
									</Card.Subtitle>
									<Badge variant="secondary" className="mr-1">
										{deal.communication_status}
									</Badge>
									<Badge variant={stage_color[deal.status]}>{deal.status}</Badge>
								</Card.Body>
							</Card>
						))}
					</Col>
				))}
			</Row>
		</Container>
	);
};
