import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import "./Question.scss";
import PropTypes from "prop-types";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";

export const Question = ({ title, options }) => {
	const [showTextArea, setShowTextArea] = useState(false);

	return (
		<Form.Group>
			<Form.Label>{title}</Form.Label>
			<div className="option-buttons">
				{options.map((optn, index) => {
					return (
						<Button onClick={() => setShowTextArea(true)} key={index} variant="light" style={{ margin: 5 }}>
							{optn.title}
						</Button>
					);
				})}
			</div>
			{showTextArea && <Form.Control as="textarea" rows={3} />}
		</Form.Group>
	);
};

Question.propTypes = {
	title: PropTypes.string,
	options: PropTypes.array
};
Question.defaultProps = {
	title: "",
	options: []
};
