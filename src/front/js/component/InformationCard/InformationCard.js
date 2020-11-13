import React, { useEffect, useContext } from "react";
import "./InformationCard.scss";
import moment from "moment";
import PropTypes from "prop-types";
import { Card, Button, Alert } from "react-bootstrap/";

export const InformationCard = ({ deal }) => {
	if (!deal) return "loading...";
	return (
		<Card style={{ width: "22rem" }} className="ml-auto">
			<Card.Body>
				<Card.Title>Candidate Information</Card.Title>
				<Card.Text>
					<b>First Name:</b> {deal.first_name}
				</Card.Text>
				<Card.Text>
					<b>Last Name:</b> {deal.last_name}
				</Card.Text>
				<Card.Text>
					<b>Email:</b> {deal.last_name}
				</Card.Text>
				<Card.Text>
					<b>Phone:</b> {deal.last_name}
				</Card.Text>
				<Card.Text>
					<b>City:</b> {deal.last_name}
				</Card.Text>
				<Alert variant="light" className="call-status">
					{deal.contacted_at} <br />
					{deal.communication_status}
					{Array.isArray(deal.activities) &&
						deal.activities.map(a => {
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
InformationCard.propTypes = {
	deal: PropTypes.object
};
InformationCard.defaultProps = {
	deal: null
};
