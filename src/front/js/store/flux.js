const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			candidates: [],
			questionnaire: null,
			interview: null,
			currentContact: null,
			agent: { id: 1 },
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
			updateContact: (id, communicationStatus) => {
				fetch(`${process.env.BACKEND_URL}/api/contact/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(communicationStatus)
				})
					.then(response => response.json())
					.then(data => console.log(data))
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			redirectNextInterview: history => {
				const store = getStore();
				fetch(`${process.env.BACKEND_URL}/api/agent/${store.agent.id}/contact/next`)
					.then(response => response.json())
					.then(data => {
						setStore({ currentContact: data });
						history.push(`/contact/${data.id}`);
					})
					.catch(error => console.log("Error loading contacs from backend", error));
			},
			startInterview: history => {
				const store = getStore();
				fetch(`${process.env.BACKEND_URL}/api/contact/${store.currentContact.id}/interview`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						questionnaire_id: store.questionnaireId,
						agent_id: store.agent.id
					})
				})
					.then(response => response.json())
					.then(data => {
						setStore({ questionnaire: data.questionnaire, interview: data.interview });
						history.push("/interview/" + data.interview.id);
					})
					.catch(error => console.log("Error loading contacs from backend", error));
			}
		}
	};
};

export default getState;
