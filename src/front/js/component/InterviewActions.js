import React, { Component, useContext, useState } from "react";
import { Context } from "../store/appContext";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import "../../styles/InterviewActions.scss";
import { useHistory } from "react-router-dom";

import { Button, Navbar, Alert } from "react-bootstrap/";

export const InterviewActions = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	const [pickDate, setPickDate] = useState();
	const [date, setDate] = useState("");
	const [message, setMessage] = useState({ label: "", type: "hidden" });

	const handleSubmit = () => {
		// i want first to popup a message for the user to confirm the change
		actions.updateInterview({ scheduled_time: date }).then(interview => history.push("/"));
	};

	return (
		<Navbar fixed="bottom" className="justify-content-end">
			{message.type != "hidden" && (
				<Alert variant={message.type} className="event-message fixed-alert">
					{message.label}
				</Alert>
			)}
			{!pickDate && (
				<>
					<Button style={{ marginRight: 5 }} variant="secondary">
						Discard
					</Button>
					<Button onClick={() => setPickDate(true)} style={{ marginRight: 5 }} variant="secondary">
						Re-schedule
					</Button>
				</>
			)}
			{pickDate && (
				<>
					<label style={{ marginRight: 5 }} htmlFor="schedule">
						Pick a time and date
					</label>
					<Datetime
						className="date-time-input"
						displayTimeZone={store.agent.time_zone}
						utc
						onChange={dateTime => setDate(dateTime)}
					/>
					<Button style={{ marginRight: 5 }} onClick={handleSubmit}>
						Send
					</Button>
					<Button style={{ marginRight: 5 }} onClick={() => setPickDate(false)}>
						Undo
					</Button>
				</>
			)}
			{!pickDate && (
				<Button
					onClick={() => {
						actions
							.updateInterview({ status: "INTERVIEWED" })
							.then(data => history.push("/"))
							.catch(error => setMessage({ label: "Unable to submit the interview", type: "danger" }));
					}}
					style={{ marginRight: 5 }}
					variant="success">
					Submit Interview
				</Button>
			)}
		</Navbar>
	);
};
