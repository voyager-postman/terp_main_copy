import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
// import Navbar from '../../Navbar/Navbar';

const AirportUpdate = () => {
	const location = useLocation()
	const nevigate = useNavigate()
	const { from } = location.state || {}
	const defaultState = {
		port_country: from && from?.port_country,
		port_city: from && from?.port_city,
		port_code: from && from?.port_code,
	}

	const [editPort, setEditPort] = useState(defaultState)

	const handleChange = (event) => {
		const { name, value } = event.target
		setEditPort((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	// Edit Port Api

	const updatePort = () => {
		const request = {
			port_id: from && from?.port_id,
			port_type_id: from && from?.port_type_id,
			port_country: editPort.port_country,
			port_city: editPort.port_city,
			port_code: editPort.port_code,
			port_name: "in",
		}

		axios
			.post(`${API_BASE_URL}/updateAirPort`, request)
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					nevigate("/airport")
					return
				}

				if (response.data.success == false) {
					toast.error(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					return false
				}
			})
			.catch((error) => {
				if (error) {
					toast.error("Network Error", {
						autoClose: 1000,
						theme: "colored",
					})
					return false
				}
			})
	}

	//Edit Port Api

	return (
		<main className="main-content">
			<div className="container-fluid">
				<nav
					className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl"
					id="navbarBlur"
					navbar-scroll="true"
				>
					<div className="container-fluid py-1 px-0">
						<nav aria-label="breadcrumb"></nav>
					</div>
				</nav>

				<div className="container-fluid pt-1 py-4 px-0">
					<div className="row">
						<div className="col-lg-12 col-md-12 mb-4">
							<div className="bg-white">
								<div className="databaseTableSection pt-0">
									<div className="grayBgColor" style={{ padding: "18px" }}>
										<div className="row">
											<div className="col-md-6">
												<h6 className="font-weight-bolder mb-0">
													Port Management / Update Form
												</h6>
											</div>
										</div>
									</div>

									<div className="top-space-search-reslute">
										<div className="tab-content px-2 md:!px-4">
											<div
												className="tab-pane active"
												id="header"
												role="tabpanel"
											>
												<div
													id="datatable_wrapper"
													className="information_dataTables dataTables_wrapper dt-bootstrap4"
												>
													<div className="d-flex exportPopupBtn"></div>
													<div className="formCreate createPackage">
														<form action="">
															<div className="row justify-content-center">
																<div className="col-lg-3 form-group">
																	<h6>Country </h6>
																	<div className="parentthb packParent">
																		<div className="childThb">
																			<input
																				type="text"
																				placeholder="country"
																			/>
																		</div>
																	</div>
																</div>
																<div className="col-lg-3 form-group">
																	<h6>City</h6>
																	<div className="parentthb packParent">
																		<div className="childThb">
																			<input type="text" placeholder="city" />
																		</div>
																	</div>
																</div>
																<div className="col-lg-3 form-group">
																	<h6>Code</h6>
																	<div className="parentthb packParent">
																		<div className="childThb">
																			<input type="text" placeholder="code" />
																		</div>
																	</div>
																</div>
																<div className="col-lg-3 form-group">
																	<h6>Inventory Type</h6>
																	<div className="parentInventory ">
																		<label htmlFor="html1">Sea</label>
																		<input
																			className="radio"
																			type="radio"
																			id="html1"
																			name="fav_language"
																			value="HTML1"
																		/>
																		<label htmlFor="css1">Air</label>
																		<input
																			type="radio"
																			id="css1"
																			name="fav_language"
																			value="CSS"
																		/>
																		<label htmlFor="css2">Land</label>
																		<input
																			type="radio"
																			id="css2"
																			name="fav_language"
																			value="CSS"
																		/>
																	</div>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
											<div className="d-flex justify-content-center">
												<div className="card-footer">
													<button
														className="btn btn-primary"
														type="submit"
														name="signup"
													>
														Update
													</button>
													<Link className="btn btn-danger" to="/airportNew">
														Cancel
													</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default AirportUpdate
