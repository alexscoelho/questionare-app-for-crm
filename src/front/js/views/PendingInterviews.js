import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap/";
import { SmartTable, TableRow } from "../component/SmartTable/SmartTable";

export const PendingInterviews = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();

	const tableHeaders = ["Contact Name", "Scheduled Time", "Status", "Score", "Contact Attempts"];

	useEffect(
		() => {
			if (!store.interviews && store.agent) actions.getNextInterviews({ status: "DRAFT" });
		},
		[store.agent]
	);

	if (!store.interviews) return "loading...";
	return (
		<Container>
			<h1>Pending Interviews</h1>
			<Row>
				<Col>
					<SmartTable headers={tableHeaders} handleSort={key => actions.getContacts({ sort: key })}>
						{store.interviews.map((interview, index) => (
							<TableRow
								key={index}
								data={interview}
								handleRedirect={() =>
									history.push(`/contact/${interview.contact_id}/interview/${interview.id}`)
								}
								onToggle={value =>
									store.interviews.map(i => {
										if (interview.id === i.id) i.checked = value;
										return i;
									})
								}
							/>
						))}
					</SmartTable>
				</Col>
			</Row>
		</Container>
	);
};
