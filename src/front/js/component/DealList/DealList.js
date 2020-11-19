import React, { useState, useContext, useEffect } from "react";
import "./DealList.scss";
import { Context } from "../../store/appContext";
import { useLocation } from "react-router-dom";
import { SmartTable, TableRow } from "../SmartTable/SmartTable";
import { Container, Row, Col, Button } from "react-bootstrap/";
import { Filters } from "../Filters/Filters";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}
export const DealList = () => {
	const { store, actions } = useContext(Context);
	const query = useQuery();
	const tableHeaders = [
		{ label: "Student", sort_value: null },
		{ label: "Deal Name", sort_value: "name" },
		{ label: "Status", sort_value: "status" },
		{ label: "Score", sort_value: null },
		{ label: "Deal Attempts", sort_value: "deal_attemps" }
	];
	const [filters, setFilters] = useState({
		status: query.get("status") || null,
		score: query.get("score") || null
	});

	const filterParams = [
		{ filterType: "select", filterValues: ["Pending", "Aproved", "Rejected", "Not Interested"] },
		{ filterType: "range", filterValues: null }
	];

	const handleClick = () => {
		alert(`There ${store.candidates.filter(c => c.checked).length} store.candidates checked`);
	};

	useEffect(() => {
		if (store.candidates === null) actions.getDeals();
	}, []);

	return (
		<Container fluid>
			<h1>Deals</h1>
			<Row>
				<Col md={8}>
					<Button style={{ marginBotton: 5 }} variant="light" onClick={handleClick}>
						Actions
					</Button>
					<SmartTable
						headers={tableHeaders}
						handleSort={(key, order) => actions.getDeals({ sort: key, order })}>
						{store.candidates !== null &&
							store.candidates
								.filter(deal => {
									if (filters.status && deal.status != filters.status) return false;
									if (filters.score && deal.status < deal.score) return false;
									return true;
								})
								.map((c, index) => (
									<TableRow
										key={index}
										data={c}
										columns={[d => d.contact.first_name, "name", "status", "score", "deal_attemps"]}
										onToggle={value =>
											store.candidates.map(deal => {
												if (c.id === deal.id) deal.checked = value;
												return deal;
											})
										}
									/>
								))}
					</SmartTable>
				</Col>

				{/*                                                           { score: 3 }     */}
				<Filters
					filterParams={filterParams}
					onChange={filterObject => setFilters({ ...filters, ...filterObject })}
				/>
			</Row>
		</Container>
	);
};
