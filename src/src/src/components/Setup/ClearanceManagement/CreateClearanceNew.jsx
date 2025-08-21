import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"

const CreateClearanceNew = () => {
	const defaultState = {
		vendor_id: 0,
		custom_clearance_charges: "",
		phyto_charges: "",
		co_chamber_charges: "",
		extra_charges: "",
	}
	const [vendorList, setVendorList] = useState([])
	const [state, setState] = useState(defaultState)
	const navigate = useNavigate()

	const handleChange = (event) => {
		const { name, value } = event.target
		setState((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	//Get Vendor List Api

	const getVendorLists = () => {
		axios
			.get(`${API_BASE_URL}/getVendorList`)
			.then((response) => {
				setVendorList(response.data.vendorList)
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
	}

	useEffect(() => {
		getVendorLists()
	}, [])

	//Get Vendor List Api

	//Add Clearance Api
	const addClearnace = async () => {
		const request = {
			vendor_id: state.vendor_id,
			from_port: 4,
			custom_clearance_charges: state.custom_clearance_charges,
			phyto_charges: state.phyto_charges,
			co_chamber_charges: state.co_chamber_charges,
			extra_charges: state.extra_charges,
		}

		console.log(request)

		const checkField =
			request.custom_clearance_charges == "" ||
			request.phyto_charges == "" ||
			request.co_chamber_charges == "" ||
			request.extra_charges == ""
		if (checkField) {
			toast.warn("Please Fill All The Fields", {
				autoClose: 1000,
				theme: "colored",
			})
			return false
		} else {
			await axios
				.post(`${API_BASE_URL}/addClearance`, request)
				.then((response) => {
					if (response.data.success == true) {
						toast.success(response.data.message, {
							autoClose: 1000,
							theme: "colored",
						})
						navigate("/clearanceNew")
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
	}
	//Add Clearance Api
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
													Clearance Management / Create Form
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
													<div className="formCreate">
														<form action="">
															<div className="row">
																<div className="form-group col-lg-3">
																	<h6>Total Clearance Charge</h6>
																	<input
																		onChange={handleChange}
																		type="number"
																		id="name_th"
																		name="custom_clearance_charges"
																		className="form-control"
																		placeholder="Name"
																		value={state.custom_clearance_charges}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Certificates</h6>
																	<input
																		onChange={handleChange}
																		type="number"
																		id="name_en"
																		name="phyto_charges"
																		className="form-control"
																		placeholder=""
																		value={state.phyto_charges}
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Chamber of Commerce</h6>
																	<input
																		onChange={handleChange}
																		type="number"
																		id="name_en"
																		name="co_chamber_charges"
																		className="form-control"
																		placeholder=""
																		value={state.co_chamber_charges}
																	/>
																</div>

																<div className="form-group col-lg-3">
																	<h6>Extras</h6>
																	<input
																		onChange={handleChange}
																		type="number"
																		id="hs_code"
																		name="extra_charges"
																		className="form-control"
																		placeholder=""
																		value={state.extra_charges}
																	/>
																</div>
																<div className="col-lg-3 form-group">
																	<h6>
																		<h6>Vendor</h6>
																	</h6>
																	<select
																		name="vendor_id"
																		onChange={handleChange}
																		value={state.vendor_id}
																		id=""
																		className=""
																	>
																		{vendorList.map((vendor) => (
																			<option value={vendor.vendor_id}>
																				{vendor.name}
																			</option>
																		))}
																	</select>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
											<div className="card-footer">
												<button
													onClick={addClearnace}
													className="btn btn-primary"
													type="submit"
													name="signup"
												>
													Create
												</button>
												<Link
													to="/clearanceNew"
													className="btn btn-danger"
													href="#"
												>
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
		</main>
	)
}

export default CreateClearanceNew
