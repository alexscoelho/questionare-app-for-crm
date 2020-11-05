import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import "./Question.scss";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";

export const Question = () => {
	const { store, actions } = useContext(Context);

	return store.questions.map((question, index) => {
		return (
			<Form.Group key={index}>
				<Form.Label>{question.title}</Form.Label>
				<div className="option-buttons">
					{question.options.map((button, index) => {
						return (
							<Button key="index" variant="light" style={{ margin: 5 }}>
								{button.title}
							</Button>
						);
					})}
				</div>
				<Form.Control as="textarea" rows={3} />
			</Form.Group>
		);
	});
};
