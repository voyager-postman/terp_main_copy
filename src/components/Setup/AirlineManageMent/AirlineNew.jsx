import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { TableView } from "../../table"
import { useTranslation } from "react-i18next";

const AirlineNew = () => {
	const { t } = useTranslation("global");
	const navigate = useNavigate()
	const [data, setData] = useState([])

	const updateAirportStatus = (airportId, status) => {
		axios
			.post(`${API_BASE_URL}/updateAirlineStatus`, {
				liner_id: airportId,
				status: status ? "on" : "off",
			})
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					getAirliner()
					return
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const getAirliner = () => {
		axios
			.get(`${API_BASE_URL}/getLiner`)
			.then((response) => {
				if (response.data.success == true) {
					setData(response.data.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		getAirliner()
	}, [])

	const columns = useMemo(
		() => [
			{
				Header:"id",
				accessor: (_row, i) => _row.liner_id,
			},

			{
				Header: t("name"),
				accessor: (a) => a.liner_name,
			},

			{
				Header: t("code"),
				accessor: (a) => a.liner_code,
			},

			{
				Header: t("serviceType"),
				accessor: (a) =>
					({ 1: "Air", 2: "Sea", 3: "Land" })[`${a.liner_type_id}`],
			},

			{
				Header: t("status"),
				accessor: (a) => (
					<label
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginBottom: "10px",
						}}
						className="toggleSwitch large"
						onclick=""
					>
						<input
							onChange={(e) =>
								updateAirportStatus(a.liner_id, e.target.checked)
							}
							type="checkbox"
							defaultChecked={a.status == "on" ? true : false}
						/>
						<span>
							<span>{t("off")}</span>
							<span>{t("on")}</span>
						</span>
						<a></a>
					</label>
				),
			},

			{
				Header: t("actions"),
				accessor: (a) => (
					<Link to="/update_airline" state={{ from: a }}>
						<i
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
		[t],
	)

	return (
		<Card
			title= {t("liner_management")}
			endElement={
				<button
					type="button"
					onClick={() => navigate("/add_airline")}
					className="btn button btn-info"
				>
					{t("create")}
				</button>
			}
		>
			<TableView columns={columns} data={data} />
		</Card>
	)
}

export default AirlineNew
