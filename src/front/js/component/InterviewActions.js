import React, { Component, useContext, useState } from "react";
import { Context } from "../store/appContext";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import "../../styles/InterviewActions.scss";

import { Button, Navbar } from "react-bootstrap/";

export const InterviewActions = () => {
	const { store, actions } = useContext(Context);
	const [pickDate, setPickDate] = useState();
	const [date, setDate] = useState("");

	const handleSubmit = () => {
		actions.updateInterview({ scheduled_time: date });
		console.log("datetime", date);
	};
	return (
		<Navbar fixed="bottom" className="justify-content-end">
			<Button style={{ marginRight: 5 }} variant="secondary">
				Discard
			</Button>
			<Button onClick={() => setPickDate(true)} style={{ marginRight: 5 }} variant="secondary">
				Re-schedule
			</Button>
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
						Hide
					</Button>
				</>
			)}
			<Button
				onClick={() => actions.updateInterview({ status: "INTERVIEWED" })}
				style={{ marginRight: 5 }}
				variant="success">
				Submit Interview
			</Button>
		</Navbar>
	);
};
