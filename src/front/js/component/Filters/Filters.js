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
						<Form key={index}>
							<Form.Group controlId="dealStatus">
								<Form.Label>{filter.label}</Form.Label>
								<Form.Control
									as="select"
									onChange={event =>
										onChange({ status: event.target.value, deal_attemps: event.target.value })
									}>
									{filter.filterValues.map((value, index) => (
										<option key={index}>{value}</option>
									))}
								</Form.Control>
							</Form.Group>
						</Form>
					);
				}
				if (filter.filterType === "range") {
					return (
						<Form key={index} onChange={onChange}>
							<Form.Group controlId="formBasicRange">
								<Form.Label>{filter.label}</Form.Label>
								<Form.Control
									type="range"
									onChange={event => onChange({ score: event.target.value })}
								/>
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
