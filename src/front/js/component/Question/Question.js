import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import "./Question.scss";
import PropTypes from "prop-types";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";

const useDebounce = (value, timeout) => {
	// Save a local copy of `value` in this state which is local to our hook
	const [state, setState] = useState(value);

	useEffect(
		() => {
			// Set timeout to run after delay
			const handler = setTimeout(() => setState(value), timeout);

			// clear the setTimeout listener on unMount
			return () => clearTimeout(handler);
		},
		[value, timeout]
	);

	return state;
};

export const Question = ({ title, options, answer }) => {
	const { store, actions } = useContext(Context);
	const [showTextArea, setShowTextArea] = useState(false);
	const [_answer, setAnswer] = useState(answer || {});
	const debouncedAnswer = useDebounce(_answer, 2000);
	useEffect(
		() => {
			if (_answer.id) {
				console.log("put answer", _answer);
				if (!_answer.ignore) actions.updateAnswer(_answer);
			} else {
				console.log("post answer", _answer);
				actions.createAnswer(_answer).then(data => setAnswer({ ...data, ignore: true }));
			}
		},
		[debouncedAnswer]
	);
	const handleChange = updatedData => {
		setAnswer({ ..._answer, ...updatedData, ignore: false });
	};

	return (
		<Form.Group>
			<Form.Label>{title}</Form.Label>
			<div className="option-buttons">
				{options.map((optn, index) => {
					return (
						<Button
							onClick={e => handleChange({ option_id: optn.id })}
							key={index}
							variant="light"
							style={{
								margin: 5,
								backgroundColor: _answer.option_id === optn.id ? "blue" : null
							}}>
							{optn.title}
						</Button>
					);
				})}
			</div>
			{_answer.option_id && (
				<Form.Control
					onChange={e => handleChange({ comments: e.target.value })}
					value={_answer.comments}
					as="textarea"
					rows={3}
				/>
			)}
		</Form.Group>
	);
};

Question.propTypes = {
	title: PropTypes.string,
	options: PropTypes.array,
	answer: PropTypes.object
};
Question.defaultProps = {
	title: "",
	options: [],
	answer: null
};
