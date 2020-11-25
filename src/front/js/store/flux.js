import moment from "moment-timezone";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			candidates: null,
			questionnaire: null,
			interview: null,
			interviews: null,
			currentDeal: null,
			agent: null,
			token: null,
			questionnaireId: 1
		},
		actions: {
			fetch: async (url, options = {}) => {
				const store = getStore();
				const resp = await fetch(url, {
					...options,
					headers: {
						...options.headers,
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token
					}
				});
				if (resp.status === 200) {
					const data = await resp.json();
					return data;
				} else if (resp.status >= 400 && resp.status < 500) {
					const e = await resp.json();
					throw new Error(e.message || e.msg || e);
				} else throw new Error("Request error");
			},
			login: async formData => {
				const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData)
				});
				if (resp.status === 200) {
					const data = await resp.json();
					setStore({ token: data.token, agent: data.agent });
					moment.tz.setDefault(agent.time_zone);
					return agent;
				} else if (resp.status >= 400 && resp.status < 500) throw await resp.json();
				else throw new Error("Could not login");
			},
			retrieveSession: () => {
				let store = localStorage.getItem("breathcode-interviews-session");
				store = JSON.parse(store);
				setStore({ ...store });
				if (store && store.agent) moment.tz.setDefault(store.agent.time_zone);
			},
			getDeals: async (opt = {}) => {
				const { status = "" } = opt;
				const actions = getActions();
				const { sort = "", order = "desc", score = "" } = opt;
				const candidates = await actions.fetch(
					`${process.env.BACKEND_URL}/api/deals?sort=${sort}&order=${order}&status=${status}`
				);
				setStore({ candidates });
			},
			getQuestionnaire: async id => {
				const actions = getActions();
				const data = await actions.fetch(`${process.env.BACKEND_URL}/api/questionnaire/${id}`);
				setStore({ questionnaire: data.questions });
			},
			getDeal: async id => {
				const actions = getActions();
				const data = await actions.fetch(`${process.env.BACKEND_URL}/api/deal/${id}`);
				setStore({ currentDeal: data });
				return data;
			},
			getInterview: async id => {
				const actions = getActions();
				const data = await actions.fetch(`${process.env.BACKEND_URL}/api/interview/${id}`);
				setStore({ interview: actions.sanitazeInterview(data) });
				return data;
			},
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
			getInterviews: async (options = {}) => {
				const { status = "" } = options;
				const { deal_name = "" } = options;
				const store = getStore();
				const actions = getActions();
				const data = await actions.fetch(
					`${process.env.BACKEND_URL}/api/agent/${
						store.agent.id
					}/interview/next?status=${status}&deal_name=${deal_name}`
				);
				setStore({ interviews: Array.isArray(data) ? data : [] });
			},
			updateDeal: async (id, dealBody) => {
				const actions = getActions();
				const data = await actions.fetch(`${process.env.BACKEND_URL}/api/deal/${id}`, {
					method: "PUT",
					body: JSON.stringify(dealBody)
				});
				const store = getStore();
				const _candidates = store.candidates || [];
				const dealExists = _candidates.find(d => d.id == data.id);
				if (dealExists) {
					setStore({
						candidates: store.candidates.map(c => {
							if (c.id == data.id) return data;
							else return c;
						}),
						currentDeal: data
					});
				} else {
					setStore({
						candidates: _candidates.concat(data),
						currentDeal: data
					});
				}
				return data;
			},
			updateInterview: async payload => {
				const store = getStore();
				const actions = getActions();
				const data = await actions.fetch(
					`${process.env.BACKEND_URL}/api/deal/${store.currentDeal.id}/interview/${store.interview.id}`,
					{
						method: "PUT",
						body: JSON.stringify(payload)
					}
				);
				return data;
			},
			redirectNextInterview: async options => {
				const { status } = options;
				const actions = getActions();
				const store = getStore();
				const data = await actions.fetch(
					`${process.env.BACKEND_URL}/api/agent/${store.agent.id}/interview/next?status=${status}`
				);
				let interview = Array.isArray(data) && data.length > 0 ? data[0] : null;
				return interview;
			},
			startInterview: async (dealId, formData) => {
				const store = getStore();
				const actions = getActions();
				let data = await actions.fetch(`${process.env.BACKEND_URL}/api/deal/${dealId}/interview`, {
					method: "POST",
					body: JSON.stringify({
						questionnaire_id: store.questionnaireId,
						agent_id: store.agent.id,
						scheduled_time: formData ? formData.dateTime : null
					})
				});
				data = actions.sanitazeInterview(data);
				setStore({ interview: data });
				return data;
			},

			createAnswer: async _answer => {
				const store = getStore();
				const actions = getActions();
				const data = await actions.fetch(`${process.env.BACKEND_URL}/api/interview/answer`, {
					method: "POST",
					body: JSON.stringify({
						comments: _answer.comments,
						interview_id: store.interview.id,
						option_id: _answer.option_id
					})
				});
				return data;
			},

			updateAnswer: async _answer => {
				const actions = getActions();
				const data = await actions.fetch(`${process.env.BACKEND_URL}/api/interview/answer/${_answer.id}`, {
					method: "PUT",
					body: JSON.stringify({
						comments: _answer.comments,
						interview_id: _answer.interview_id,
						option_id: _answer.option_id
					})
				});
				return data;
			},
			deleteNote: async (activityId, dealId) => {
				const store = getStore();
				const actions = getActions();
				const data = await actions.fetch(`${process.env.BACKEND_URL}/api/activity/${activityId}`, {
					method: "DELETE",
					body: JSON.stringify({
						deal_id: dealId
					})
				});
				currentDeal;
				setStore((store.currentDeal.activities = data));
				return data;
			}
		}
	};
};

export default getState;
