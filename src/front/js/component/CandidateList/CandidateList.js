import React, { useState, useContext } from "react";
import "./CandidateList.scss";
import { Context } from "../../store/appContext";

import { SmartTable, TableRow } from "../SmartTable/SmartTable";
import { Container, Row, Col, Button } from "react-bootstrap/";

const candidates = [
	{ id: 1, firstName: "Bob", lastName: "Dylan", checked: false },
	{ id: 2, firstName: "Sam", lastName: "Dylan", checked: false },
	{ id: 3, firstName: "Cyndy", lastName: "Dylan", checked: false },
	{ id: 4, firstName: "Delta", lastName: "Dylan", checked: false }
];

export const CandidateList = () => {
	const { store, actions } = useContext(Context);
	const [contacts, setContacts] = useState(candidates);

	const handleClick = () => {
		alert(`There ${contacts.filter(c => c.checked).length} contacts checked`);
	};

	const handleSort = () => {
		setContacts(
			contacts.sort((a, b) => {
				if (a.firstName > b.firstName) {
					return 1;
				}
				if (a.firstName < b.firstName) {
					return -1;
				}
				return 0;
			})
		);
	};

	return (
		<Container fluid>
			<h1>Candidates</h1>
			<Row>
				<Col md={8}>
					<Button style={{ marginBotton: 5 }} variant="light" onClick={handleClick}>
						Actions
					</Button>
					<SmartTable handleSort={handleSort}>
						{contacts.map((c, index) => (
							<TableRow
								key={index}
								contact={c}
								onToggle={value =>
									setContacts(
										contacts.map(contact => {
											if (c.id === contact.id) contact.checked = value;
											return contact;
										})
									)
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
