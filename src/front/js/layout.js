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
import { CandidateList } from "./component/CandidateList/CandidateList.js";
import { PendingInterviews } from "./views/PendingInterviews";
import { Private } from "./component/Private/Private.js";

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

						<Route exact path="/">
							<Dashboard />
						</Route>
						<Route exact path="/deal/:dealId">
							<CommunicationStatus />
						</Route>
						<Route exact path="/deal/:dealId/interview/:interviewId">
							<InterviewCall />
						</Route>
						<Route exact path="/candidatelist">
							<CandidateList />
						</Route>
						<Route exact path="/pending/interviews">
							<PendingInterviews />
						</Route>
						<Route exact path="/demo">
							<Demo />
						</Route>
						<Route exact path="/single/:theid">
							<Single />
						</Route>
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
