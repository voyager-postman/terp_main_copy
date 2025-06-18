// import axios from "axios"
import { useMemo } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"
import { Card } from "../../card"
import { TableView } from "../table"
import axios from "../../Url/Api";

const Vendor = () => {
	const { data } = useQuery("getAllVendor")
	const navigate = useNavigate()
	const updateVendorStatus = (id) => {
		const request = {
			vendor_id: id,
		}

		axios
			.post(`${API_BASE_URL}/updateVendorStatus`, request)
			.then((response) => {
				toast[response.data.success ? "success" : "error"](
					response.data.message,
					{
						autoClose: 1000,
						theme: "colored",
					},
				)
			})
			.catch((error) => {
				console.log(error)
				if (error) {
					toast.error("Network Error", {
						autoClose: 1000,
						theme: "colored",
					})
					return
				}
			})
			.finally(() => {
				// setLoading(false)
			})
	}
	const columns = useMemo(
		() => [
			{
				Header: "Id",
				id: "index",
				accessor: (_row, i) => _row.vendor_id,
			},
			{
				Header: "Name",
				accessor: (a) => a.name,
			},
			{
				Header: "Phone",
				accessor: (a) => a.phone || <i className="text-gray-400">N/A</i>,
			},
			{
				Header: "Status",
				accessor: (a) => (
					<>
						{" "}
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
								onChange={() => updateVendorStatus(a.ID)}
								type="checkbox"
								defaultChecked={a.status == "on"}
							/>
							<span>
								<span>OFF</span>
								<span>ON</span>
							</span>
							<a></a>
						</label>
					</>
				),
			},
			{
				Header: "Actions",
				accessor: (a) => (
					<>
						<Link to="/update_vendor" state={{ from: a }}>
							<i
								i
								className="mdi mdi-pencil"
								style={{
									width: "20px",
									color: "#203764",
									marginTop: "10px",
									paddingTop: "8px",
									fontSize: "22px",
								}}
							/>
						</Link>
					</>
				),
			},
			{
				Header: "Line ID",
				accessor: (a) => a.line_id || <i className="text-gray-400">N/A</i>,
			},
		],
		[],
	)

	return (
		<>
			<Card
				title={"Vendor Management"}
				endElement={
					<button
						type="button"
						onClick={() => navigate("/add_vendor")}
						className="btn button btn-info"
					>
						Create
					</button>
				}
			>
				<TableView columns={columns} data={data || []} />
			</Card>
		</>
	)
}

export default Vendor
