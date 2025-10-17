import axios from "axios"
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { BiEdit } from "react-icons/bi"
import { Link } from "react-router-dom"
import { API_BASE_URL } from "../../../Url/Url"
import { TableView } from "../../table"

const CurrencyNew = () => {
	const [data, setData] = useState([])

	const getCurrencyData = () => {
		axios
			.get(`${API_BASE_URL}/getCurrency`)
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
		getCurrencyData()
	}, [])

	const columns = useMemo(
		() => [
			{
				Header: "Id",
				accessor: (_row, i) => <>{i + 1}</>,
			},

			{
				Header: "Currency",
				accessor: (a) => <>{a.currency}</>,
			},

			{
				Header: "Default Value",
				accessor: (a) => <>{a.fx_rate}</>,
			},

			{
				Header: "Created",
				accessor: (a) => moment(a.created).format("DD-MM-YYYY"),
			},

			{
				Header: "Status",
				accessor: (a) => (
					<div style={{ marginTop: "-8px" }}>
						<BlueSwitch {...label} defaultChecked />
					</div>
				),
			},

			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/udpate_currency" state={{ from: a }}>
						<BiEdit
							style={{ width: "20px", color: "blue", fontSize: "20px" }}
						/>
					</Link>
				),
			},
		],
		[],
	)

	return (
		<main className="main-content">
			<div className="container-fluid">
				<nav
					className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl"
					id="navbarBlur"
					navbar-scroll="true"
				>
					<div className="container-fluid py-1 px-0">
						<nav aria-label="breadcrumb">
							<ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
								<li className="breadcrumb-item text-sm">
									<a className="text-dark">Setup</a>
								</li>
								<li
									className="breadcrumb-item text-sm text-dark active"
									aria-current="page"
								>
									Produce Items
								</li>
							</ol>
						</nav>
					</div>
				</nav>

				<div className="container-fluid pt-1 py-4 px-0">
					<div className="row">
						<div className="col-lg-12 col-md-12 mb-4">
							<div className="bg-white">
								<div className="databaseTableSection pt-0">
									<div className="grayBgColor p-4 pt-2 pb-2">
										<div className="row">
											<div className="col-md-6">
												<h6 className="font-weight-bolder mb-0 pt-2">
													Currency Management
												</h6>
											</div>
											<div className="col-md-6">
												<div className="exportPopupBtn create_btn_style">
													<button className="btn button btn-info">
														Create
													</button>
												</div>
											</div>
										</div>
									</div>

									<TableView columns={columns} data={data} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default CurrencyNew
