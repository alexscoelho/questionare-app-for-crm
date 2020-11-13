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
				<Card.Title>Deal Information</Card.Title>
				<Card.Text>
					<p className="m-0">
						<strong>Status:</strong> {deal.communication_status}
					</p>
					<p className="m-0">
						<strong>First Name:</strong> {deal.contact.first_name}
					</p>
					<p className="m-0">
						<strong>Last Name:</strong> {deal.contact.last_name}
					</p>
					<p className="m-0">
						<strong>Email:</strong> {deal.contact.email}
					</p>
					<p className="m-0">
						<strong>Phone:</strong> {deal.contact.phone}
					</p>
					<p className="m-0">
						<strong>Contact Attempts:</strong> {deal.deal_attemps}
					</p>
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
