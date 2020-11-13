const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			candidates: [],
			questionnaire: null,
			interview: null,
			interviews: null,
			currentDeal: null,
			agent: null,
			questionnaireId: 1
		},
		actions: {
			// Use getActions to call a function within a fuction
			getDeals: (opt = {}) => {
				const { sort = "", score = "" } = opt;
				fetch(`${process.env.BACKEND_URL}/api/deals?sort=${sort}`)
					.then(response => response.json())
					.then(data => setStore({ candidates: data }))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			login: async () => {
				const store = getStore();
				const actions = getActions();
				const agent = { id: 1, time_zone: "America/New_York" };
				setStore({ agent });
				moment.tz.setDefault(agent.time_zone);
				return agent;
			},
			retrieveSession: history => {
				const store = localStorage.getItem("breathcode-interviews-session");
				setStore(JSON.parse(store));
			},

			getQuestionnaire: id => {
				fetch(`${process.env.BACKEND_URL}/api/questionnaire/${id}`)
					.then(response => response.json())
					.then(data => setStore({ questionnaire: data.questions }))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			getDeal: id => {
				fetch(`${process.env.BACKEND_URL}/api/deal/${id}`)
					.then(response => response.json())
					.then(data => setStore({ currentDeal: data }))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			getInterview: id =>
				new Promise((resolve, reject) => {
					const store = getStore();
					const actions = getActions();
					fetch(`${process.env.BACKEND_URL}/api/interview/${id}`)
						.then(response => response.json())
						.then(data => {
							setStore({ interview: actions.sanitazeInterview(data) });
							resolve(data);
						})
						.catch(error => {
							reject(error);
							console.log("Error loading contacs from backend", error);
						});
				}),
			sanitazeInterview: interview => {
				let questions = interview.questionnaire.questions.map(q => {
					for (let a in interview.answers) {
						a = interview.answers[a];
						const option = q.options.find(o => o.id === a.option_id);

						if (typeof option === "object") {
							q.answer = a;
							return q;
						}
					}
					return q;
				});
				return {
					...interview,
					questionnaire: {
						...interview.questionnaire,
						questions
					}
				};
			},
			getNextInterviews: (opt = {}) =>
				new Promise((resolve, reject) => {
					const { status } = opt;
					const store = getStore();
					fetch(`${process.env.BACKEND_URL}/api/agent/${store.agent.id}/interview/next?status=${status}`)
						.then(response => response.json())
						.then(data => {
							setStore({ interviews: Array.isArray(data) ? data : [] });
							resolve(data);
						})
						.catch(error => {
							reject(error);
							console.log("Error loading contacs from backend", error);
						});
				}),

			updateDeal: (id, dealBody) => {
				fetch(`${process.env.BACKEND_URL}/api/deal/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(dealBody)
				})
					.then(response => response.json())
					.then(data => console.log(data))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			updateInterview: payload => {
				const store = getStore();
				fetch(`${process.env.BACKEND_URL}/api/deal/${store.currentDeal.id}/interview/${store.interview.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload)
				})
					.then(response => response.json())
					.then(data => console.log(data))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			redirectNextInterview: () =>
				new Promise((resolve, reject) => {
					const store = getStore();
					fetch(`${process.env.BACKEND_URL}/api/agent/${store.agent.id}/deal/next`)
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
							setStore({ currentDeal: data });
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
				const actions = getActions();
				fetch(`${process.env.BACKEND_URL}/api/deal/${store.currentDeal.id}/interview`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						questionnaire_id: store.questionnaireId,
						agent_id: store.agent.id,

						scheduled_time: formData ? formData.dateTime : null
					})
				})
					.then(response => response.json())
					.then(data => {
						setStore({ interview: actions.sanitazeInterview(data) });
						history.push(`/deal/${params.dealId}/interview/${data.id}`);
					})
					.catch(error => console.log("Error loading contacs from backend", error));
			},

			createAnswer: async _answer => {
				const store = getStore();
				const actions = getActions();
				const response = await fetch(`${process.env.BACKEND_URL}/api/interview/answer`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						comments: _answer.comments,
						interview_id: store.interview.id,
						option_id: _answer.option_id
					})
				});
				const data = await response.json();
				return data;
			},

			updateAnswer: _answer => {
				const store = getStore();
				const actions = getActions();
				fetch(`${process.env.BACKEND_URL}/api/interview/answer/${_answer.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						comments: _answer.comments,
						interview_id: _answer.interview_id,
						option_id: _answer.option_id
					})
				})
					.then(response => response.json())
					.then(data => console.log(data))
					.catch(error => console.log("Error loading contacs from backend", error));
			}
		}
	};
};

export default getState;
