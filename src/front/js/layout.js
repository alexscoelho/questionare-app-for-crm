import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./views/home";
import { Demo } from "./views/demo";
import { Single } from "./views/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";

import { Login } from "./component/Login/Login.js";
import { Dashboard } from "./component/Dashboard/Dashboard.js";
import { CommunicationStatus } from "./component/CommunicationStatus/CommunicationStatus.js";
import { InterviewCall } from "./component/InterviewCall/InterviewCall.js";
import { DealList } from "./component/DealList/DealList.js";
import { InterviewList } from "./views/InterviewList";
import { PrivateRoute } from "./component/PrivateRoute.js";

//create your first component
const Layout = () => {
	//the basename is used when your project is published in a subdirectory and not in the root of the domain
	// you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
	const basename = process.env.BASENAME || "";

	return (
		<div className="d-flex flex-column h-100">
			<BrowserRouter basename={basename}>
				<ScrollToTop>
					<Navbar />
					<Switch>
						<Route exact path="/login">
							<Login />
						</Route>

						<PrivateRoute exact path="/">
							<Dashboard />
						</PrivateRoute>
						<PrivateRoute exact path="/deal/:dealId">
							<CommunicationStatus />
						</PrivateRoute>
						<PrivateRoute exact path="/deal/:dealId/interview/:interviewId">
							<InterviewCall />
						</PrivateRoute>
						<PrivateRoute exact path="/deals">
							<DealList />
						</PrivateRoute>
						<PrivateRoute exact path="/interviews">
							<InterviewList />
						</PrivateRoute>
						<PrivateRoute exact path="/demo">
							<Demo />
						</PrivateRoute>
						<PrivateRoute exact path="/single/:theid">
							<Single />
						</PrivateRoute>
						<Route>
							<h1>Not found!</h1>
						</Route>
					</Switch>
				</ScrollToTop>
			</BrowserRouter>
		</div>
	);
};

export default injectContext(Layout);
