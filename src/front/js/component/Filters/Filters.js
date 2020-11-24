import React from "react";
import PropTypes from "prop-types";
import "./Filters.scss";

import { Col, Form, Button } from "react-bootstrap/";

export const Filters = ({ filterParams, onChangeFilters, handleSearch }) => {
	return (
		<Col md={2} className="filter-options">
			<p>Filter by:</p>
			{filterParams.map((filter, index) => {
				if (filter.filterType === "select") {
					return (
						<Form key={index}>
							<Form.Group controlId="dealStatus">
								<Form.Label>{filter.label}</Form.Label>
								<Form.Control as="select" onChange={event => onChangeFilters(event.target.value)}>
									{filter.filterValues.map((value, index) => (
										<option key={index}>{value}</option>
									))}
								</Form.Control>
							</Form.Group>
						</Form>
					);
				}
				if (filter.filterType === "search") {
					return (
						<div>
							<p>{filter.label}</p>
							<input
								onChange={event => handleSearch(event.target.value)}
								type="text"
								placeholder="search"
							/>
						</div>
					);
				}
			})}
		</Col>
	);
};

Filters.propTypes = {
	filterParams: PropTypes.array,
	onChangeFilters: PropTypes.func,
	handleSearch: PropTypes.func
};

Filters.defaultProps = {
	filterParams: [],
	onChangeFilters: null,
	handleSearch: null
};
