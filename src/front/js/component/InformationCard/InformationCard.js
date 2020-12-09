import React, { useState } from "react";
import "./InformationCard.scss";
import moment from "moment";
import { Context } from "../../store/appContext";
import PropTypes from "prop-types";

import { Card, Button, Alert, Popover } from "react-bootstrap/";

export const InformationCard = ({ deal, onAddNewNote, onDeleteNote }) => {
	if (!deal) return "loading...";

	const [addNote, setAddNote] = useState(false);
	const [noteContent, setNoteContent] = useState("");
	const [formStatus, setFormStatus] = useState({ status: "idle", message: "" });

	return (
		<Card style={{ width: "22rem" }} className="m-auto">
			<Card.Body>
				<Card.Title>Deal Information</Card.Title>
				<Card.Text>
					<p className="m-0">
						<strong>Name:</strong> {deal.name}
					</p>
					<p className="m-0">
						<strong>Status:</strong> {deal.communication_status || "-"}
					</p>
					<p className="m-0">
						<strong>Student:</strong> {`${deal.contact.first_name} ${deal.contact.last_name}`}
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
				{deal.activities.length !== 0 && (
					<div className="notes-box" style={{ backgroundColor: "#EFEFEF" }}>
						<div className="arrow" />
						{Array.isArray(deal.activities) &&
							deal.activities
								.slice(0)
								.reverse()
								.map(a => {
									return (
										<li key={a.id}>
											{a.activity_type == "NOTE" && (
												<i
													onClick={() =>
														onDeleteNote(a.id, a.deal_id).then(message =>
															console.log(message)
														)
													}
													className="fas fa-trash-alt float-right p-3"
												/>
											)}
											<h5 className="m-0">{a.details}</h5>
											<span>{moment(a.created_at).fromNow()}</span>
										</li>
									);
								})}
					</div>
				)}

				<Card.Link style={{ marginTop: 5 }} onClick={() => setAddNote(!addNote)} href="#">
					Add new note
				</Card.Link>

				{formStatus.status == "danger" && <Alert variant="danger">{formStatus.message}</Alert>}
				{addNote && (
					<>
						<input
							onChange={event => setNoteContent(event.target.value)}
							style={{ marginLeft: 5, marginTop: 10 }}
							type="text"
							value={noteContent}
						/>
						<Button
							size="sm"
							style={{ marginLeft: 5 }}
							onClick={() => {
								if (noteContent && noteContent != "") {
									if (onAddNewNote) {
										onAddNewNote(noteContent);
										setNoteContent("");
									}
								} else setFormStatus({ status: "danger", message: "Empty form status" });
							}}>
							Save
						</Button>
					</>
				)}
			</Card.Body>
		</Card>
	);
};
InformationCard.propTypes = {
	deal: PropTypes.object,
	onAddNewNote: PropTypes.func,
	onDeleteNote: PropTypes.func
};
InformationCard.defaultProps = {
	deal: null,
	onAddNewNote: null,
	onDeleteNote: null
};
