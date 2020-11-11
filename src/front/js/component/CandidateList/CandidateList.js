import React, { useState, useContext, useEffect } from "react";
import "./CandidateList.scss";
import { Context } from "../../store/appContext";

import { SmartTable, TableRow } from "../SmartTable/SmartTable";
import { Container, Row, Col, Button } from "react-bootstrap/";

export const CandidateList = () => {
	const { store, actions } = useContext(Context);
	const tableHeaders = ["Student", "Interview", "Aproved", "Score", "Test", "Last Contact"];

	const handleClick = () => {
		alert(`There ${store.candidates.filter(c => c.checked).length} store.candidates checked`);
	};

	return (
		<Container fluid>
			<h1>Candidates</h1>
			<Row>
				<Col md={8}>
					<Button style={{ marginBotton: 5 }} variant="light" onClick={handleClick}>
						Actions
					</Button>
					<SmartTable headers={tableHeaders} handleSort={key => actions.getContacts({ sort: key })}>
						{store.candidates.map((c, index) => (
							<TableRow
								key={index}
								data={c}
								onToggle={value =>
									store.candidates.map(contact => {
										if (c.id === contact.id) contact.checked = value;
										return contact;
									})
								}
							/>
						))}
					</SmartTable>
				</Col>
				<Col md={2} className="filter-options">
					<p>Filter by:</p>
					<Button variant="light" block>
						{" "}
						Interview status
						<span>
							<i className="fas fa-arrow-down" />
						</span>
					</Button>
					<Button variant="light" block>
						Approved status
						<span>
							<i className="fas fa-arrow-down" />
						</span>
					</Button>
					<Button variant="light" block>
						Score
						<span>
							<i className="fas fa-arrow-down" />
						</span>
					</Button>
				</Col>
			</Row>
		</Container>
	);
};
