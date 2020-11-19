import React from "react";
import "./SmartTable.scss";
import PropTypes from "prop-types";

export const TableRow = ({ data, onToggle, handleRedirect, columns }) => {
	if (!data) return <p>Loading</p>;
	return (
		<tr className="grid">
			<td scope="row">
				<input type="checkbox" onClick={() => onToggle(!data.checked)} value={data.checked} />
			</td>
			{columns.map((c, index) => {
				const value = typeof c === "string" ? data[c] : c(data);
				return <td key={index}>{value || "-"}</td>;
			})}

			<td>
				<a href="#" onClick={() => handleRedirect()}>
					details <i className="far fa-arrow-alt-circle-right" />
				</a>
			</td>
		</tr>
	);
};

export const SmartTable = ({ children, handleSort, headers }) => {
	const [desc, setDesc] = React.useState(true);
	const [sort, setSort] = React.useState(null);
	return (
		<table>
			<tr>
				<th />
				{headers.map((header, index) => {
					return (
						<th key={index}>
							{header.label}{" "}
							{header.sort_value && (
								<i
									className="fas fa-sort"
									onClick={() => {
										setSort(header.sort_value);
										if (header.sort_value === sort) {
											const newDesc = !desc;
											setDesc(newDesc);
											handleSort(header.sort_value, newDesc ? "desc" : "asc");
										} else {
											setDesc(!true);
											handleSort(header.sort_value, "desc");
										}
									}}
								/>
							)}
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
	handleRedirect: PropTypes.function,
	columns: PropTypes.array
};

TableRow.defaultProps = {
	onToggle: null,
	data: [],
	handleRedirect: null,
	columns: []
};

SmartTable.propTypes = {
	children: PropTypes.node,
	handleSort: PropTypes.func,
	headers: PropTypes.array
};

SmartTable.defaultProps = {
	children: null,
	handleSort: null,
	headers: []
};
