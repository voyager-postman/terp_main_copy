import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { TableView } from "../../table"
import { useTranslation } from "react-i18next";

const ClearanceNew = () => {
	const { t } = useTranslation("global");
	const navigate = useNavigate()
	const [data, setData] = useState([])
	const [status, setStatus] = useState("on")
	const [isOn, setIsOn] = useState(true)
	const getClearanceData = () => {
		axios
			.get(`${API_BASE_URL}/getClearance`)
			.then((response) => {
				setData(response.data.data)
			})
			.catch((error) => {
				console.log(error)
				if (error) {
					toast.error(t("networkError"), {
						autoClose: 1000,
						theme: "colored",
					})
					return
				}
			})
	}

	useEffect(() => {
		getClearanceData()
	}, [])

	const updateStatus = (clearance_id) => {
		axios
			.post(`${API_BASE_URL}/updateClearanceStatus`, {
				clearance_id: clearance_id,
			})
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					getClearanceData()
					return
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}
	const columns = React.useMemo(
		() => [
			{
				Header: t("id"),
				id: "index",
				accessor: (_row, i) => i + 1,
			},
			{
				Header: t("vendor"),
				accessor: "name",
			},
			{
				Header: t("portOfOrigin"),
				accessor: "port_name",
			},
			{
				Header: t("portType"),
				accessor: "port_type",
			},

			{
				Header: t("status"),
				accessor: (a) => (
					<label
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginTop: "6px",
						}}
						className="toggleSwitch large"
						onclick=""
					>
						<input
							onChange={() => setIsOn(!isOn)}
							onClick={() => updateStatus(a.clearance_id)}
							type="checkbox"
							checked={a.status == "on" ? true : false}
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
					<Link to="/updateClearanceNew" state={{ from: a }}>
						<i
							i
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
		[t],
	)

	return (
		<Card
			title={t("clearance_management")}
			endElement={
				<button
					type="button"
					onClick={() => navigate("/createClearanceNew")}
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

export default ClearanceNew
