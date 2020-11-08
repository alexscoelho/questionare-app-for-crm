import React from "react";
import "./InformationCard.scss";

import { Card, Button, Alert } from "react-bootstrap/";

export const InformationCard = p => {
	const contactInformation = {
		firstName: "Pascual",
		lastName: "Angulo",
		email: "pascualangulo@gmail.com",
		phone: "786333111",
		city: "San Jose de Costa Rica"
	};
	console.log("contact", p);
	if (!p.contact) return "loading...";
	return (
		<Card style={{ width: "22rem" }} className="ml-auto">
			<Card.Body>
				<Card.Title>Candidate Information</Card.Title>
				{/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle> */}
				<Card.Text>
					<b>First Name:</b> {p.contact.first_name}
				</Card.Text>
				<Card.Text>
					<b>Last Name:</b> {contactInformation.lastName}
				</Card.Text>
				<Card.Text>
					<b>Email:</b> {contactInformation.email}
				</Card.Text>
				<Card.Text>
					<b>Phone:</b> {contactInformation.phone}
				</Card.Text>
				<Card.Text>
					<b>City:</b> {contactInformation.city}
				</Card.Text>
				<Alert variant="light" className="call-status">
					2 days ago missed call <br />
					Se le llamo pero no contesto
				</Alert>
				<Card.Link href="#">Add new note</Card.Link>
			</Card.Body>
		</Card>
	);
};
