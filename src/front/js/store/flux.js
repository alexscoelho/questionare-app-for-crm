const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			candidates: [],
			questionnaire: null,
			interview: null,
			interviews: null,
			currentContact: null,
			agent: { id: 1, time_zone: "America/New_York" },
			questionnaireId: 1
		},
		actions: {
			// Use getActions to call a function within a fuction
			getContacts: (opt = {}) => {
				const { sort = "", score = "" } = opt;
				fetch(`${process.env.BACKEND_URL}/api/contacts?sort=${sort}`)
					.then(response => response.json())
					.then(data => setStore({ candidates: data }))
					.catch(error => console.log("Error loading contacs from backend", error));
			},

			getQuestionnaire: id => {
				fetch(`${process.env.BACKEND_URL}/api/questionnaire/${id}`)
					.then(response => response.json())
					.then(data => setStore({ questionnaire: data.questions }))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			getContact: id => {
				fetch(`${process.env.BACKEND_URL}/api/contact/${id}`)
					.then(response => response.json())
					.then(data => setStore({ currentContact: data }))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			getInterview: id =>
				new Promise((resolve, reject) => {
					const store = getStore();
					fetch(`${process.env.BACKEND_URL}/api/interview/${id}`)
						.then(response => response.json())
						.then(data => {
							setStore({ interview: data });
							resolve(data);
						})
						.catch(error => {
							reject(error);
							console.log("Error loading contacs from backend", error);
						});
				}),
			getNextInterviews: (opt = {}) =>
				new Promise((resolve, reject) => {
					const { status } = opt;
					const store = getStore();
					fetch(`${process.env.BACKEND_URL}/api/agent/${store.agent.id}/interview/next?status=${status}`)
						.then(response => response.json())
						.then(data => {
							setStore({ interviews: data });
							resolve(data);
						})
						.catch(error => {
							reject(error);
							console.log("Error loading contacs from backend", error);
						});
				}),

			updateContact: (id, contactBody) => {
				fetch(`${process.env.BACKEND_URL}/api/contact/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(contactBody)
				})
					.then(response => response.json())
					.then(data => console.log(data))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			updateInterview: (interviewId, interview) => {
				const store = getStore();
				fetch(`${process.env.BACKEND_URL}/api/contact/${store.currentContact.id}/interview/${interviewId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(interview)
				})
					.then(response => response.json())
					.then(data => console.log(data))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			redirectNextInterview: () =>
				new Promise((resolve, reject) => {
					const store = getStore();
					fetch(`${process.env.BACKEND_URL}/api/agent/${store.agent.id}/contact/next`)
						.then(async response => {
							console.log("response:", response);
							if (response.status === 200) return await response.json();
							else if (response.status === 400) {
								console.log("entro al 400");
								const error = await response.json();
								throw new Error(error.message);
							} else {
								throw new Error("imposible to retrieve an interview for this agent");
							}
						})

						.then(data => {
							setStore({ currentContact: data });
							console.log("no deberia");
							resolve(data);
						})
						.catch(error => {
							reject(error);
							console.log("Error loading contacs from backend", error);
						});
				}),

			startInterview: (history, params, formData) => {
				const store = getStore();
				fetch(`${process.env.BACKEND_URL}/api/contact/${store.currentContact.id}/interview`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						questionnaire_id: store.questionnaireId,
						agent_id: store.agent.id,
						scheduled_time: formData.dateTime
					})
				})
					.then(response => response.json())
					.then(data => {
						setStore({ interview: data });
						history.push(`/contact/${params.contactId}/interview/${data.id}`);
					})
					.catch(error => console.log("Error loading contacs from backend", error));
			}
		}
	};
};

export default getState;
