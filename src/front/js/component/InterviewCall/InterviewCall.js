import React, { useContext, useEffect } from "react";
import "./InterviewCall.scss";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";

import { Container, Col, Row, Card, Button, Form } from "react-bootstrap/";
import { InformationCard } from "../InformationCard/InformationCard.js";
import { Question } from "../Question/Question.js";
import { InterviewActions } from "../InterviewActions";

export const InterviewCall = () => {
	const params = useParams();
	const { store, actions } = useContext(Context);

	useEffect(() => {
		if (!store.interview) {
			if (params.interviewId !== null) {
				actions.getInterview(params.interviewId);
			} else {
				actions.getInterview(store.interviews[0].id);
			}
		}
		if (!store.currentContact) {
			actions.getContact(params.contactId);
		}
	}, []);

	if (!store.interview) return "loading...";
	console.log("interview sanitazed", store.interview);

	return (
		<Container fluid>
			{store.currentContact === null ? (
				<h1>No more contacts to interview</h1>
			) : (
				<Row>
					<Col md={8}>
						{store.interview.questionnaire.questions.map((question, index) => {
							return (
								<Question
									answer={question.answer || null}
									key={index}
									title={question.title}
									options={question.options}
								/>
							);
						})}
					</Col>
					<Col md={4}>
						<InformationCard contact={store.currentContact} />
					</Col>
				</Row>
			)}
			<InterviewActions />
		</Container>
	);
};
