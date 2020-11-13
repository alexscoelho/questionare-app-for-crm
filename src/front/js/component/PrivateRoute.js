import React from "react";
import { Route, useHistory } from "react-router-dom";
import PropTypes from "prop-types";

export const PrivateRoute = ({ children, ...rest }) => {
	let store = localStorage.getItem("breathcode-interviews-session");
	store = JSON.parse(store);

	const history = useHistory();
	if (!store || !store.token) {
		history.push("/login");
		return "Redirecting";
		console.log("Hello");
	}
	return <Route {...rest}>{children}</Route>;
};

PrivateRoute.propTypes = {
	children: PropTypes.node
};
PrivateRoute.defaultProps = {
	children: null
};
