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

	const tableHeaders = ["Deal Name", "Scheduled Time", "Status", "Score", "Deal Attempts"];

	useEffect(
		() => {
			if (!store.interviews && store.agent) actions.getInterviews({ status: query.status });
		},
		[store.agent]
	);

	if (!store.interviews) return "loading...";
	return (
		<Container>
			<h1>Pending Interviews</h1>
			<Row>
				<Col>
					<SmartTable headers={tableHeaders} handleSort={key => actions.getDeals({ sort: key })}>
						{store.interviews.map((interview, index) => (
							<TableRow
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
