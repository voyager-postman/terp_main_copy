import { Link } from "react-router-dom"

const AddFreight = () => {
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
													Frieght Management / Create Form
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
																<div className="col-lg-3 form-group">
																	<h6>Vendor</h6>
																	<select name="" id="" className="">
																		<option value="volvo">Volvo</option>
																		<option value="saab">Saab</option>
																		<option value="opel">Opel</option>
																		<option value="audi">Audi</option>
																	</select>
																</div>
																<div className="col-lg-3 form-group">
																	<h6>Destination</h6>
																	<select name="" id="" className="">
																		<option value="volvo">Volvo</option>
																		<option value="saab">Saab</option>
																		<option value="opel">Opel</option>
																		<option value="audi">Audi</option>
																	</select>
																</div>
																<div className="col-lg-3 form-group">
																	<h6>Airline</h6>
																	<select name="" id="" className="">
																		<option value="volvo">Volvo</option>
																		<option value="saab">Saab</option>
																		<option value="opel">Opel</option>
																		<option value="audi">Audi</option>
																	</select>
																</div>

																<div className="col-lg-3 form-group">
																	<h6>Currency</h6>
																	<select name="" id="" className="">
																		<option value="volvo">Volvo</option>
																		<option value="saab">Saab</option>
																		<option value="opel">Opel</option>
																		<option value="audi">Audi</option>
																	</select>
																</div>
															</div>
															<div
																id="datatable_wrapper"
																className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
															>
																<table
																	id="example"
																	className="display table table-hover table-striped borderTerpProduce table-responsive"
																	style={{ width: "100%" }}
																>
																	<thead>
																		<tr>
																			<th></th>
																			<th>50</th>
																			<th>75</th>
																			<th>100</th>
																			<th>500</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr
																			className="rowCursorPointer"
																			data-bs-toggle="modal"
																			data-bs-target="#myModal"
																		>
																			<td scope="row">Rate</td>

																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>

																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>
																		</tr>
																		<tr
																			className="rowCursorPointer"
																			data-bs-toggle="modal"
																			data-bs-target="#myModal"
																		>
																			<td scope="row">Negotiated Rate</td>

																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght">
																					<div className="parentShip">
																						<div className="markupShip">
																							<input
																								type="number"
																								style={{ width: "280px" }}
																							/>
																						</div>
																						<div
																							className="shipPercent"
																							style={{ height: "39px;" }}
																						>
																							<span>Kg+</span>
																						</div>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</form>
													</div>
												</div>
											</div>
											<div className="card-footer">
												<button
													className="btn btn-primary"
													type="submit"
													name="signup"
												>
													Create
												</button>
												<Link className="btn btn-danger" to={"/freightNew"}>
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

export default AddFreight
