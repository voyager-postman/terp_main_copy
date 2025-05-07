import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { TableView } from "../../table"

const Hourly = () => {
	const navigate = useNavigate()
	const [data, setData] = useState([])

	const getLocationData = () => {
		axios
			.get(`${API_BASE_URL}/getAllWage`)
			.then((response) => {
				setData(response.data.data || [])
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		getLocationData()
	}, [])

	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				id: "index",
				accessor: (_row, i) => _row.wages_id,
			},
			{
				Header: "From",
				accessor: "from_time",
			},

			{
				Header: "To",
				accessor: "to_time",
			},

			{
				Header: "Name",
				accessor: "shift_name_en",
			},
			{
				Header: "Monday",
				accessor: "Monday",
			},
			{
				Header: "Tuesday",
				accessor: "Tuesday",
			},
			{
				Header: "Wednesday",
				accessor: "Wednesday",
			},
			{
				Header: "Thursday",
				accessor: "Thursday",
			},
			{
				Header: "Friday",
				accessor: "Friday",
			},
			{
				Header: "Saturday",
				accessor: "Saturday",
			},
			{
				Header: "Sunday",
				accessor: "Sunday",
			},

			{
				Header: "Wage",
				accessor: "wage",
			},

			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/updateHourly" state={{ from: a }}>
						<i
							className="mdi mdi-pencil"
							style={{
								width: "20px",
								color: "#203764",
								fontSize: "22px",
								marginTop: "10px",
							}}
						/>
					</Link>
				),
			},
		],
		[],
	)

	return (
		<Card
			title="Wages Management"
			endElement={
				<button
					type="button"
					onClick={() => navigate("/addHourly")}
					className="btn button btn-info"
				>
					Create
				</button>
			}
		>
			<TableView columns={columns} data={data} />
		</Card>
	)
}

export default Hourly
