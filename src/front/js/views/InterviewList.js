import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useHistory, useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap/";
import { SmartTable, TableRow } from "../component/SmartTable/SmartTable";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}
export const InterviewList = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	const query = useQuery();

	const tableHeaders = [
		{ label: "Deal Name", sort_value: "name" },
		{ label: "Scheduled Time", sort_value: null },
		{ label: "Status", sort_value: "status" },
		{ label: "Score", sort_value: "score" },
		{ label: "Student", sort_value: "null" }
	];

	useEffect(
		() => {
			if (!store.interviews && store.agent) actions.getInterviews({ status: query.status });
		},
		[store.agent]
	);

	console.log("interviews:", store.interviews);

	if (!store.interviews) return "loading...";

	return (
		<Container>
			<h1>Pending Interviews</h1>
			<Row>
				<Col>
					<SmartTable headers={tableHeaders} handleSort={key => actions.getDeals({ sort: key })}>
						{store.interviews.map((interview, index) => (
							<TableRow
								columns={[
									d => d.deal.name,
									"scheduled_time",
									"status",
									"score_total",
									e => e.deal.contact.first_name
								]}
								key={index}
								data={interview}
								handleRedirect={() =>
									history.push(`/deal/${interview.deal_id}/interview/${interview.id}`)
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
