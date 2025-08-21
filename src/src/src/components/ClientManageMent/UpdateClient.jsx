import { Link, useLocation } from "react-router-dom"

const UpdateClient = () => {
	const location = useLocation()
	const { from } = location.state || {}

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
									<div className="grayBgColor p-4 pt-2 pb-2">
										<div className="row">
											<div className="col-md-6">
												<h6 className="font-weight-bolder mb-0 pt-2">
													Client / Edit Form
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
													className="information_dataTables dataTables_wrapper dt-bootstrap4 "
												>
													<div className="d-flex exportPopupBtn"></div>
													<div className="formCreate">
														<form action="">
															<div className="row justify-content-center">
																<div className="form-group col-lg-6">
																	<h6> Name</h6>
																	<input
																		type="text"
																		id="name_en"
																		name="client_name"
																		className="form-control"
																		placeholder=" name "
																		defaultValue={from && from?.client_name}
																	/>
																</div>
																<div className="form-group col-lg-6">
																	<h6>Tax Number</h6>
																	<input
																		type="number"
																		id="name_en"
																		name="client_tax_number"
																		className="form-control"
																		placeholder="123 "
																		defaultValue={
																			from && from?.client_tax_number
																		}
																	/>
																</div>
															</div>
															<div className="row justify-content-center">
																<div className="form-group col-lg-6">
																	<h6>Email</h6>
																	<input
																		type="email"
																		id="hs_name"
																		name="client_email"
																		className="form-control"
																		placeholder="admin@gmail.com"
																		defaultValue={from && from?.client_email}
																	/>
																</div>
																<div className="form-group col-lg-6">
																	<h6>Phone Number</h6>
																	<input
																		type="number"
																		id="hs_name"
																		name="client_phone"
																		className="form-control"
																		placeholder="123456789"
																		defaultValue={from && from?.client_phone}
																	/>
																</div>
															</div>
															<div className="row ">
																<div className="form-group col-lg-12">
																	<h6>Address</h6>
																	<textarea
																		className="col-lg-12 rounded h-20"
																		style={{ border: "2px solid #245486" }}
																		defaultValue={from && from?.client_address}
																		name="client_address"
																		id=""
																	></textarea>
																</div>
															</div>
															<h6
																className="mt-4"
																style={{
																	fontWeight: "600",
																	marginBottom: "10px",
																	fontSize: "20px",
																}}
															>
																{" "}
																Bank Informations
															</h6>
															<div className="row ">
																<div className="form-group col-lg-4">
																	<h6>Bank Name</h6>

																	<input
																		type="text"
																		id="name_en"
																		name="client_bank_name"
																		className="form-control"
																		placeholder="axis "
																		defaultValue={
																			from && from?.client_bank_name
																		}
																	/>
																</div>
																<div className="form-group col-lg-4">
																	<h6>Account Name</h6>
																	<input
																		type="text"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="xxxxx "
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-4">
																	<h6>Account Number</h6>
																	<input
																		type="text"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="3345345435 "
																		value=""
																	/>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
											<div className="card-footer text-center ">
												<button
													className="btn btn-primary"
													type="submit"
													name="signup"
												>
													Update
												</button>
												<Link className="btn btn-danger" to={"/clientNew"}>
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

export default UpdateClient
