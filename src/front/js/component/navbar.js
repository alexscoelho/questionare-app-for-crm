import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light mb-3">
			<Link to="/">
				<span className="navbar-brand mb-0 h1">React Boilerplate</span>
			</Link>
			<div className="ml-auto">
				<Link to="/">Dashboard</Link>
				<a
					href="#"
					className="ml-4"
					onClick={e => {
						e.preventDefault();
						localStorage.setItem("breathcode-interviews-session", null);
						window.location.href = "/login";
					}}>
					Log out
				</a>
			</div>
		</nav>
	);
};
