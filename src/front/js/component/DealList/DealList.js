import React, { useState, useContext, useEffect } from "react";
import "./DealList.scss";
import { Context } from "../../store/appContext";
import { useLocation, useHistory } from "react-router-dom";
import { SmartTable, TableRow } from "../SmartTable/SmartTable";
import { Container, Row, Col, Button } from "react-bootstrap/";
import { Filters } from "../Filters/Filters";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}
export const DealList = () => {
	const { store, actions } = useContext(Context);
	const history = useHistory();
	const query = useQuery();
	const tableHeaders = [
		{ label: "Student", sort_value: null },
		{ label: "Deal Name", sort_value: "name" },
		{ label: "Status", sort_value: "status" },
		{ label: "Contacted at", sort_value: null },
		{ label: "Deal Attempts", sort_value: "deal_attemps" }
	];
	const [filters, setFilters] = useState({
		status: "" || null
	});

	console.log("filters:", filters);

	const filterParams = [
		{
			filterType: "select",
			filterValues: ["PENDING", "APROVED", "REJECTED", "NOT_INTERESTED"],
			label: "Deal Status"
		}
	];

	const handleClick = () => {
		alert(`There ${store.allDeals.filter(c => c.checked).length} store.allDeals checked`);
	};

	useEffect(
		() => {
			if (store.allDeals === null) {
				actions.getDeals();
			} else if (filters.status !== "" || filters.status !== null) {
				actions.getDeals({ status: filters.status });
			}
		},
		[filters]
	);

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
						{store.allDeals !== null &&
							store.allDeals
								.filter(deal => {
									if (filters.status && deal.status != filters.status) return false;
									if (filters.score && deal.status < deal.score) return false;
									return true;
								})
								.map((c, index) => (
									<TableRow
										key={index}
										data={c}
										handleRedirect={() => {
											actions.getDeal(c.id);
											history.push(`/deal/${c.id}`);
										}}
										columns={[
											d => d.contact.first_name,
											"name",
											"status",
											"contacted_at",
											"deal_attemps"
										]}
										onToggle={value =>
											store.allDeals.map(deal => {
												if (c.id === deal.id) deal.checked = value;
												return deal;
											})
										}
									/>
								))}
					</SmartTable>
				</Col>

				<Filters
					filterParams={filterParams}
					onChangeFilters={filterTerm => setFilters({ status: filterTerm })}
				/>
			</Row>
		</Container>
	);
};
