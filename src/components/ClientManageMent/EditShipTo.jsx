import { Link } from "react-router-dom"

const EditShipTo = () => {
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
													Consignee / Edit Form
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
																<div className="form-group col-lg-3">
																	<h6> Client</h6>

																	<div className="ceateTransport">
																		<select name="" id="">
																			<option value="">Client 1</option>
																			<option value="">Client 2</option>
																			<option value="">Client 3</option>
																			<option value="">Client 4</option>
																		</select>
																	</div>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Name</h6>
																	<input
																		type="number"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="ms saxena "
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Tax Number</h6>
																	<input
																		type="number"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="123 "
																		value=""
																	/>
																</div>

																<div className="form-group col-lg-3">
																	<h6>Email</h6>
																	<input
																		type="email"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="123 "
																		value=""
																	/>
																</div>
															</div>
															<div className="row ">
																<div className="form-group col-lg-3">
																	<h6>Phone Number</h6>
																	<input
																		type="number"
																		id="hs_name"
																		name="hs_name"
																		className="form-control"
																		placeholder="123456789"
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6> Airport</h6>

																	<div className="ceateTransport">
																		<select name="" id="">
																			<option value="">Airport 1</option>
																			<option value="">Airport 2</option>
																			<option value="">Airport 3</option>
																			<option value="">Airport 4</option>
																		</select>
																	</div>
																</div>
																<div className="form-group col-lg-3">
																	<h6> Airline</h6>
																	<div className="ceateTransport">
																		<select name="" id="">
																			<option value="">
																				Please Select Airline
																			</option>
																			<option value="">Airport 2</option>
																			<option value="">Airport 3</option>
																			<option value="">Airport 4</option>
																		</select>
																	</div>
																</div>
																<div className="form-group col-lg-3">
																	<h6> Clearance</h6>
																	<div className="ceateTransport">
																		<select name="" id="">
																			<option value="">
																				Please Select Clearance
																			</option>
																			<option value="">
																				Excel Transport International Co., Ltd.
																			</option>
																			<option value="">Sea - Coconut</option>
																			<option value="">Sea - Karachi</option>
																		</select>
																	</div>
																</div>
															</div>
															<div className="row ">
																<div className="form-group col-lg-3">
																	<h6>Markup Rate</h6>
																	<div className="parentShip">
																		<div className="markupShip">
																			<input type="number" />
																		</div>
																		<div className="shipPercent">
																			<span>%</span>
																		</div>
																	</div>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Rebate</h6>
																	<div className="parentShip">
																		<div className="markupShip">
																			<input type="number" />
																		</div>
																		<div className="shipPercent">
																			<span>%</span>
																		</div>
																	</div>
																</div>
																<div className="form-group col-lg-3">
																	<h6> Commission</h6>
																	<div className="ceateTransport">
																		<select name="" id="">
																			<option value="">Pershipment</option>
																			<option value="">Per Box</option>
																			<option value="">Per Kg</option>
																			<option value="">Airport 4</option>
																		</select>
																	</div>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Commission Value</h6>
																	<input
																		type="number"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="123 "
																		value=""
																	/>
																</div>

																<div className="form-group col-lg-12">
																	<h6>Address</h6>
																	<textarea name="" id=""></textarea>
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
																	Notify :
																</h6>

																<div className="form-group col-lg-6">
																	<h6> Name</h6>

																	<input
																		type="text"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder=" name "
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-6">
																	<h6>Tax Number</h6>
																	<input
																		type="number"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="123 "
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-6">
																	<h6> Email</h6>
																	<input
																		type="email"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="admin@gmail.com "
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-6">
																	<h6> Phone Number</h6>
																	<input
																		type="email"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="123"
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-12">
																	<h6>Address</h6>
																	<textarea name="" id=""></textarea>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
											<div className="card-footer text-center">
												<button
													className="btn btn-primary"
													type="submit"
													name="signup"
												>
													Update
												</button>
												<Link className="btn btn-danger" to="/shipToNew">
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

export default EditShipTo
