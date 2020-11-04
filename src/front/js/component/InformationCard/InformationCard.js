import React from "react";
import "./InformationCard.scss";

import { Card, Button } from "react-bootstrap/";

export const InformationCard = () => {
	return (
		<Card style={{ width: "18rem" }} className="ml-auto">
			<Card.Body>
				<Card.Title>Card Title</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
				<Card.Text>
					Some quick example text to build on the card title and make up the bulk of the cards content.
				</Card.Text>
				<Card.Link href="#">Card Link</Card.Link>
				<Card.Link href="#">Another Link</Card.Link>
			</Card.Body>
		</Card>
	);
};
