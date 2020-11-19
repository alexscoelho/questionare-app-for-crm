import React from "react";
import PropTypes from "prop-types";
import "./Filters.scss";

import { Row, Col, Button, Form } from "react-bootstrap/";

export const Filters = ({ filterObject }) => {
	return (
		<Col md={2} className="filter-options">
			<p>Filter by:</p>
			{filterObject.filterType === "select" && (
				<Form.Group controlId="exampleForm.ControlSelect1">
					<Form.Control as="select">
						{filterObject.filterValues.map((value, index) => (
							<option key={index}>{value}</option>
						))}
					</Form.Control>
				</Form.Group>
			)}
		</Col>
	);
};

Filters.propTypes = {
	filterObject: PropTypes.object
};

Filters.defaultProps = {
	filterObject: null
};
