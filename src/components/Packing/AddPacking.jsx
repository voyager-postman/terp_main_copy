import { Link } from "react-router-dom"

const AddPacking = () => {
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
													Packing Management/ Create Form
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
																	<h6>Item</h6>
																	<select name="" id="" className="">
																		<option value="volvo">Select Item</option>
																		<option value="saab">Item 1</option>
																		<option value="opel">Item 1</option>
																		<option value="audi">Item 1</option>
																	</select>
																</div>

																<div className="form-group col-lg-3">
																	<h6>Quantity</h6>
																	<input
																		type="number"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="lenght"
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6 style={{ color: "white" }}>
																		work detail
																	</h6>
																	<div className="workDetail">
																		<button>Work Detail</button>
																	</div>
																</div>
															</div>
															<div className="row">
																<div className="form-group col-lg-3">
																	<h6>Number of Staff</h6>
																	<input
																		type="number"
																		id="hs_name"
																		name="hs_name"
																		className="form-control"
																		placeholder="12"
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Start</h6>
																	<input
																		type="time"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="weight"
																		value=""
																	/>
																</div>
																<div className="form-group col-lg-3">
																	<h6>Finish</h6>
																	<input
																		type="time"
																		id="name_en"
																		name="name_en"
																		className="form-control"
																		placeholder="automatic calculation"
																		value=""
																	/>
																</div>
															</div>
														</form>
														<form>
															<div
																id="datatable_wrapper"
																className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
															>
																<table
																	id="example"
																	className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
																	style={{ width: "100%" }}
																>
																	<thead>
																		<tr>
																			<th>EAN</th>
																			<th>Quantity</th>
																			<th>Unit</th>
																			<th>Action</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr
																			className="rowCursorPointer"
																			data-bs-toggle="modal"
																			data-bs-target="#myModal"
																		>
																			<td>
																				<div
																					className="ceateTransport"
																					style={{ width: "280px" }}
																				>
																					<select name="" id="">
																						<option value="">EAN 1</option>
																						<option value=""> EAN 2</option>
																					</select>
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="number" />
																				</div>
																			</td>
																			<td>
																				<div
																					className="ceateTransport"
																					style={{ width: "280px" }}
																				>
																					<select name="" id="">
																						<option value="">Unit </option>
																						<option value="">1 </option>
																						<option value="">2 </option>
																					</select>
																				</div>
																			</td>

																			<td className="editIcon">
																				<a>
																					{" "}
																					<i
																						className="fa fa-trash"
																						aria-hidden="true"
																					></i>
																				</a>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
															<div className="addBtnEan">
																<button className="mt-1">Add</button>
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
												<Link className="btn btn-danger" to="/packingNew">
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

export default AddPacking
