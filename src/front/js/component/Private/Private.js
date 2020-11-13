import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

export const Private = ({ children }) => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	if (!store.agent) history.push("/login");
	return <>{children}</>;
};

Private.propTypes = {
	children: PropTypes.node
};
Private.defaultProps = {
	children: null
};
