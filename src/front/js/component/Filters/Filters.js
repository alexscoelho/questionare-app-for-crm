import React from "react";
import PropTypes from "prop-types";
import "./Filters.scss";

import { Col, Form } from "react-bootstrap/";

export const Filters = ({ filterParams, onChange }) => {
	return (
		<Col md={2} className="filter-options">
			<p>Filter by:</p>
			{filterParams.map((filter, index) => {
				if (filter.filterType === "select") {
					return (
						<Form.Group controlId="dealStatus">
							<Form.Label>Deal Status</Form.Label>
							<Form.Control as="select">
								{filter.filterValues.map((value, index) => (
									<option key={index}>{value}</option>
								))}
							</Form.Control>
						</Form.Group>
					);
				}
				if (filter.filterType === "range") {
					return (
						<Form>
							<Form.Group controlId="formBasicRange">
								<Form.Label>Score</Form.Label>
								<Form.Control type="range" />
							</Form.Group>
						</Form>
					);
				}
			})}
		</Col>
	);
};

Filters.propTypes = {
	filterParams: PropTypes.array,
	onChange: PropTypes.func
};

Filters.defaultProps = {
	filterParams: [],
	onChange: null
};
