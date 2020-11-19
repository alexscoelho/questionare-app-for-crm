import React from "react";
import PropTypes from "prop-types";
import "./Filters.scss";

import { Row, Col, Button } from "react-bootstrap/";

export const Filters = () => {
	return (
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
	);
};
