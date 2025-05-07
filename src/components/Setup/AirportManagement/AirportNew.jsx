import axios from "axios"
import React, { useEffect, useState } from "react"
import BarCode from "react-barcode"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { TableView } from "../../table"

const AirportNew = () => {
	const navigate = useNavigate()
	const [data, setData] = useState([])

	const updateAirportStatus = (airportId) => {
		const request = {
			port_id: airportId,
		}

		axios
			.post(`${API_BASE_URL}/updateAirportStatus`, request)
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					getAirportData()
					return
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	// Update Airport Status

	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				id: "index",
				accessor: (_row, i) => i + 1,
			},

			{
				Header: "Country",
				accessor: "port_country",
			},

			{
				Header: "Code",
				// accessor: (a) => <BarCode width={0.8} height={30} value={a.port_type_id=="2"? a.Seaport_code:a.IATA_code} />,
				accessor: (a) => a.port_type_id === "2" ? a.Seaport_code : a.IATA_code
			},

			{
				Header: "City",
				accessor: "port_city",
			},

			{
				Header: "Port Type",
				accessor: "port_type",
			},

			{
				Header: "Airport Name",
				accessor: "port_name",
			},

			{
				Header: "Status",
				accessor: (a) => (
					<label
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginTop: "10px",
						}}
						className="toggleSwitch large"
						onclick=""
					>
						<input
							onChange={() => updateAirportStatus(a.port_id)}
							type="checkbox"
							defaultChecked={a.status == "on" ? true : false}
						/>
						<span>
							<span>OFF</span>
							<span>ON</span>
						</span>
						<a></a>
					</label>
				),
			},

			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/airport_update" state={{ from: a }}>
						<i
							i
							className="mdi mdi-pencil"
							style={{
								width: "22px",
								color: "#203764",
								fontSize: "20px",
								marginTop: "10px",
							}}
						/>
					</Link>
				),
			},

		
		],
		[],
	)
	const getAirportData = () => {
		axios
			.get(`${API_BASE_URL}/getAllAirports`)
			.then((response) => {
				if (response.data.success == true) {
					setData(response.data.data)
				}
			})
			.catch((error) => {
				console.log(error)
				if (error) {
					toast.error("Network Error", {
						autoClose: 1000,
						theme: "colored",
					})
					return false
				}
			})
	}

	useEffect(() => {
		getAirportData()
	}, [])

	return (
		<Card
			title="Airport Management"
			endElement={
				<button
					type="button"
					onClick={() => navigate("/airport_create")}
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

export default AirportNew
