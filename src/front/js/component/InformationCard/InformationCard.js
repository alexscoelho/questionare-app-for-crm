import React, { useEffect, useContext } from "react";
import "./InformationCard.scss";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import moment from "moment";

import { Card, Button, Alert } from "react-bootstrap/";

export const InformationCard = p => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	useEffect(() => {
		console.log("Test1", store);
		if (!store.currentDeal) {
			console.log("Test2");
			actions.getDeal(params.dealId);
		}
	}, []);

	if (!p.deal) return "loading...";
	console.log("deal:", p.deal);
	return (
		<Card style={{ width: "22rem" }} className="ml-auto">
			<Card.Body>
				<Card.Title>Candidate Information</Card.Title>
				<Card.Text>
					<b>First Name:</b> {p.deal.first_name}
				</Card.Text>
				<Card.Text>
					<b>Last Name:</b> {p.deal.last_name}
				</Card.Text>
				<Card.Text>
					<b>Email:</b> {p.deal.last_name}
				</Card.Text>
				<Card.Text>
					<b>Phone:</b> {p.deal.last_name}
				</Card.Text>
				<Card.Text>
					<b>City:</b> {p.deal.last_name}
				</Card.Text>
				<Alert variant="light" className="call-status">
					{p.deal.contacted_at} <br />
					{p.deal.communication_status}
					{p.deal.activities.map(a => {
						return (
							<li key={a.id}>
								<h5 className="m-0">{a.details}</h5>
								<span>{moment(a.created_at).fromNow()}</span>
							</li>
						);
					})}
				</Alert>
				<Card.Link href="#">Add new note</Card.Link>
			</Card.Body>
		</Card>
	);
};
