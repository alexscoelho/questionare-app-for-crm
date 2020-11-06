import React from "react";
import "./SmartTable.scss";
import PropTypes from "prop-types";

export const TableRow = ({ contact, onToggle }) => {
	return (
		<tr className="grid">
			<td scope="row">
				<input type="checkbox" onClick={() => onToggle(!contact.checked)} value={contact.checked} />
			</td>
			<td>{contact.firstName}</td>
			<td>{contact.lastName}</td>
			<td>{contact.lastName}</td>
			<td>{contact.lastName}</td>
			<td>{contact.lastName}</td>
			<td>{contact.lastName}</td>
			<td>
				<a href="#">
					details <i className="far fa-arrow-alt-circle-right" />
				</a>
			</td>
		</tr>
	);
};

export const SmartTable = ({ children, handleSort }) => {
	const sortContacts = () => {
		handleSort();
	};
	return (
		<table>
			<tr>
				<th />
				<th>
					Student <i className="fas fa-sort" onClick={sortContacts} />
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
