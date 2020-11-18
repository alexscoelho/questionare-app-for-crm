import React from "react";
import "./SmartTable.scss";
import PropTypes from "prop-types";

export const TableRow = ({ data, onToggle, handleRedirect }) => {
	return (
		<tr className="grid">
			<td scope="row">
				<input type="checkbox" onClick={() => onToggle(!data.checked)} value={data.checked} />
			</td>
			<td>{data.first_name || data.contact.first_name}</td>
			<td>{data.interview_status || data.name}</td>
			<td>{data.approved_status || data.status}</td>
			<td>{data.first_name || data.interview[0].score_total}</td>
			<td>{data.first_name || data.interview[0].status}</td>
			<td>{data.first_name}</td>
			<td>
				<a href="#" onClick={() => handleRedirect()}>
					details <i className="far fa-arrow-alt-circle-right" />
				</a>
			</td>
		</tr>
	);
};

export const SmartTable = ({ children, handleSort, headers }) => {
	return (
		<table>
			<tr>
				<th />
				{headers.map((header, index) => {
					return (
						<th key={index}>
							{header} <i className="fas fa-sort" onClick={() => handleSort("first_name")} />
						</th>
					);
				})}
				<th />
			</tr>
			{children}
		</table>
	);
};

TableRow.propTypes = {
	onToggle: PropTypes.any,
	data: PropTypes.array,
	handleRedirect: PropTypes.function
};

SmartTable.propTypes = {
	children: PropTypes.any,
	handleSort: PropTypes.any,
	headers: PropTypes.array
};
