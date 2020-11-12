import React, { Component, useContext } from "react";
import { Context } from "../store/appContext";

import { Button, Navbar } from "react-bootstrap/";

export const InterviewActions = () => {
	const { store, actions } = useContext(Context);

	return (
		<Navbar fixed="bottom" className="justify-content-end">
			<Button style={{ marginRight: 5 }} variant="secondary">
				Discard
			</Button>
			<Button
				onClick={() =>
					actions.updateContact(store.currentContact.id, {
						interview_status: "Incomplete"
					})
				}
				style={{ marginRight: 5 }}
				variant="secondary">
				Save as draft
			</Button>
			<Button
				onClick={() => actions.updateInterview(store.interview.id, { status: "interviewed" })}
				style={{ marginRight: 5 }}
				variant="success">
				Submit Interview
			</Button>
		</Navbar>
	);
};
