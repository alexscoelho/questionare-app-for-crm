const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			candidates: [],
			questions: [
				{
					answer: [],
					id: 1,
					options: [
						{
							id: 6,
							question_id: 1,
							title: "N/A",
							value: "0"
						}
					],
					questionnaire_id: 1,
					title: "1.  ¿Cómo se enteró de este proyecto?"
				},
				{
					answer: [],
					id: 2,
					options: [
						{
							id: 3,
							question_id: 2,
							title: "Internet y computador compartido",
							value: "6"
						},
						{
							id: 4,
							question_id: 2,
							title: "Internet y compotador propio",
							value: "7"
						},
						{
							id: 5,
							question_id: 2,
							title: "no internet",
							value: "0"
						}
					],
					questionnaire_id: 1,
					title: "2.    Este es un curso virtual. ¿Tiene actualmente una computadora e internet disponible?"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getContacts: (opt = {}) => {
				const { sort = "", score = "" } = opt;
				fetch(`${process.env.BACKEND_URL}/api/contacts?sort=${sort}`)
					.then(response => response.json())
					.then(data => setStore({ candidates: data }))
					.catch(error => console.log("Error loading contacs from backend", error));
			},

			getMessage: () => {
				// fetching data from the backend
				fetch(process.env.BACKEND_URL + "/api/hello")
					.then(resp => resp.json())
					.then(data => setStore({ message: data.message }))
					.catch(error => console.log("Error loading message from backend", error));
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
