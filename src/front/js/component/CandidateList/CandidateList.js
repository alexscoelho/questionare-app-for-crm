import React, { useState } from "react";
import "./CandidateList.scss";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import { Container, Row, Col, Button } from "react-bootstrap/";

export const CandidateList = () => {
	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);

	const [rowData, setRowData] = useState([
		{
			student: "Pepe",
			interview: "full-stack",
			approved: "workshop",
			score: 20,
			lastContact: "3 days ago"
		},
		{ student: "Jose", interview: "full-stack", approved: "workshop", score: 15, lastContact: "1 days ago" },
		{ student: "Juan", interview: "full-stack", approved: "workshop", score: 35, lastContact: "2 days ago" }
	]);

	const onButtonClick = e => {
		const selectedNodes = gridApi.getSelectedNodes();
		const selectedData = selectedNodes.map(node => node.data);
		const selectedDataStringPresentation = selectedData.map(node => node.student + " " + node.score).join(", ");
		alert(`Selected nodes: ${selectedDataStringPresentation}`);
	};

	function onGridReady(params) {
		setGridApi(params.api);
		setGridColumnApi(params.columnApi);
	}

	return (
		<Container fluid>
			<h1>Interviewed candidates</h1>
			<Row>
				<Col md={8}>
					<div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
						<Button variant="secondary" style={{ marginBottom: 5 }} onClick={onButtonClick}>
							Delete
						</Button>
						<AgGridReact rowData={rowData} rowSelection="multiple" onGridReady={onGridReady}>
							<AgGridColumn field="student" sortable={true} filter={true} checkboxSelection={true} />
							<AgGridColumn field="interview" sortable={true} filter={true} />
							<AgGridColumn field="approved" sortable={true} filter={true} />
							<AgGridColumn field="score" sortable={true} filter={true} />
							<AgGridColumn field="lastContact" sortable={true} filter={true} />
						</AgGridReact>
					</div>
				</Col>
				<Col md={4}>{/* <Button>Interview status</Button> */}</Col>
			</Row>
		</Container>
	);
};
