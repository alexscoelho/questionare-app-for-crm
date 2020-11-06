import React from "react";
import "./SmartTable.scss";
import PropTypes from "prop-types";

export const TableRow = ({ contact, onToggle }) => {
	return (
		<tr className="grid">
			<td scope="row">
				<input type="checkbox" onClick={() => onToggle(!contact.checked)} value={contact.checked} />
			</td>
			<td>{contact.first_name}</td>
			<td>{contact.interview_status}</td>
			<td>{contact.approved_status}</td>
			<td>{contact.first_name}</td>
			<td>{contact.first_name}</td>
			<td>{contact.first_name}</td>
			<td>
				<a href="#">
					details <i className="far fa-arrow-alt-circle-right" />
				</a>
			</td>
		</tr>
	);
};

export const SmartTable = ({ children, handleSort }) => {
	return (
		<table>
			<tr>
				<th />
				<th>
					Student <i className="fas fa-sort" onClick={() => handleSort("first_name")} />
				</th>
				<th>Interview</th>
				<th>Aproved</th>
				<th>Score</th>
				<th>Test</th>
				<th>Last Contact</th>
				<th />
			</tr>
			{children}
		</table>
	);
};

TableRow.propTypes = {
	contact: PropTypes.any,
	onToggle: PropTypes.any
};

SmartTable.propTypes = {
	children: PropTypes.any,
	handleSort: PropTypes.any
};
