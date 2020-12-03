import React, { useContext, useState } from "react";
import "./Dashboard.scss";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";

import moment from "moment";
import { Container, Alert, Col, Row, Card, Badge } from "react-bootstrap/";
import { useEffect } from "react";

const STAGES = ["PENDING", "APPROVED", "REJECTED", "NOT_INTERESTED"];
const stage_color = {
	PENDING: "warning",
	APPROVED: "success",
	REJECTED: "danger",
	NOT_INTERESTED: "secondary"
};
export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	const [alertData, setAlertData] = useState({});
	const [deals, setDeals] = useState({
		PENDING: [],
		APPROVED: [],
		REJECTED: [],
		NOT_INTERESTED: []
	});
	const [interviews, setInterviews] = useState({
		PENDING: [],
		DRAFT: [],
		POSTPONED: [],
		COMPLETED: [],
		NOT_STARTED: []
	});
	const [message, setMessage] = useState({ label: "", type: "hidden" });
	const steps = [
		{
			message: `Scheduled interviews`,
			link: "View all",
			callTo: "scheduled",
			stage: "POSTPONED",
			lengthIdicator: interviews.POSTPONED.length
		},
		{
			message: `Pending interviews`,
			link: "Start next Int.",
			callTo: "new",
			stage: "PENDING",
			lengthIdicator: interviews.NOT_STARTED.length
		},
		{
			message: `Unfinished Interviews`,
			link: "View all",
			callTo: "incomplete",
			stage: "DRAFT",
			lengthIdicator: interviews.DRAFT.length
		},
		{
			message: `All Deals`,
			link: "View All",
			callTo: "dealList",
			stage: "COMPLETED",
			lengthIdicator: 0
		}
	];

	const handleStepClick = alert => {
		setAlertData({ ...alertData, selected: alert.callTo });

		if (alert.callTo === "new") {
			if (interviews.NOT_STARTED.length > 0) history.push(`/deal/${interviews.NOT_STARTED[0].id}`);
			if (interviews.NOT_STARTED.length === 0) setMessage({ label: "No pending interviews", type: "danger" });
		}
		// actions
		// 	.redirectNextInterview({ status: "PENDING" })
		// 	.then(interview => {
		// 		history.push(`/deal/${interview.deal_id}`);
		// 	})
		// 	.catch(error => setMessage({ label: error.message || error, type: "danger" }));
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
			if (!store.allDeals) actions.getDeals();
			else if (Array.isArray(store.allDeals))
				setDeals({
					PENDING: store.allDeals.filter(c => c.status == "PENDING"),
					APPROVED: store.allDeals.filter(c => c.status == "APPROVED"),
					REJECTED: store.allDeals.filter(c => c.status == "REJECTED"),
					NOT_INTERESTED: store.allDeals.filter(c => c.status == "NOT_INTERESTED")
				});
		},
		[store.allDeals]
	);
	useEffect(
		() => {
			if (!store.interviews) actions.getInterviews();
			else if (Array.isArray(store.interviews))
				if (store.allDeals)
					setInterviews({
						PENDING: store.allDeals.filter(c => c.status == "PENDING"),
						DRAFT: store.allDeals.filter(c => c.status == "DRAFT"),
						POSTPONED: store.allDeals.filter(c => c.status == "POSTPONED"),
						COMPLETED: store.allDeals.filter(c => c.status == "COMPLETED"),
						NOT_STARTED: store.allDeals.filter(c => c.interview.length == 0)
					});
		},
		[store.allDeals]
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
										{/* {s.lengthIdicator} */}
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
										actions.getDeal(deal.id);
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
									<Badge className="mr-1" variant={stage_color[deal.status]}>
										{deal.status}
									</Badge>
									{deal.interview.length > 0 && deal.interview[0].status === "COMPLETED" ? (
										<Badge variant="success">{`INTERVIEW ${deal.interview[0].status}`}</Badge>
									) : null}
								</Card.Body>
							</Card>
						))}
					</Col>
				))}
			</Row>
		</Container>
	);
};
