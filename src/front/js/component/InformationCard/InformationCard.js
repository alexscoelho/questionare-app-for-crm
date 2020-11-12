import React, { useEffect, useContext } from "react";
import "./InformationCard.scss";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";

import { Card, Button, Alert } from "react-bootstrap/";

export const InformationCard = p => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	useEffect(() => {
		console.log("Test1", store);
		if (!store.currentContact) {
			console.log("Test2");
			actions.getContact(params.contactId);
		}
	}, []);

	if (!p.contact) return "loading...";
	console.log("contact:", p.contact);
	return (
		<Card style={{ width: "22rem" }} className="ml-auto">
			<Card.Body>
				<Card.Title>Candidate Information</Card.Title>
				<Card.Text>
					<b>First Name:</b> {p.contact.first_name}
				</Card.Text>
				<Card.Text>
					<b>Last Name:</b> {p.contact.last_name}
				</Card.Text>
				<Card.Text>
					<b>Email:</b> {p.contact.last_name}
				</Card.Text>
				<Card.Text>
					<b>Phone:</b> {p.contact.last_name}
				</Card.Text>
				<Card.Text>
					<b>City:</b> {p.contact.last_name}
				</Card.Text>
				<Alert variant="light" className="call-status">
					{p.contact.contacted_at} <br />
					{p.contact.communication_status}
					{p.contact.activities.map(a => {
						return <li key={a.id}>{a.details}</li>;
					})}
				</Alert>
				<Card.Link href="#">Add new note</Card.Link>
			</Card.Body>
		</Card>
	);
};
