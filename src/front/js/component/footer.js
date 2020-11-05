import React, { Component } from "react";

import { Button, Navbar } from "react-bootstrap/";

export const Footer = () => {
	return (
		<Navbar fixed="bottom" className="justify-content-end">
			<Button style={{ marginRight: 5 }} variant="secondary">
				Discard
			</Button>
			<Button style={{ marginRight: 5 }} variant="secondary">
				Save as draft
			</Button>
			<Button style={{ marginRight: 5 }} variant="success">
				Submit Interview
			</Button>
		</Navbar>
	);
};
