import { Link } from "react-router-dom"

const AddTransport = () => {
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
													Transportation Management / Create Form
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
															</div>
															<div
																id="datatable_wrapper"
																className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
															>
																<table
																	id="example"
																	className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
																	style={{ width: "100%" }}
																>
																	<thead>
																		<tr>
																			<th>Transportation</th>
																			<th>Max Weight</th>
																			<th className="w-5">Max CBM</th>
																			<th>Pallets</th>
																			<th>Price</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr
																			className="rowCursorPointer"
																			data-bs-toggle="modal"
																			data-bs-target="#myModal"
																		>
																			<td scope="row">
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>

																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>

																			<td>
																				<div className="thbFrieght ceateTransport">
																					<div className="parentthb">
																						<div className="childThb">
																							<input type="text" />
																						</div>
																						<div className="childThbBtn">
																							<p>THB</p>
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
																			<td scope="row">
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>

																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>

																			<td>
																				<div className="thbFrieght ceateTransport">
																					<div className="parentthb">
																						<div className="childThb">
																							<input type="text" />
																						</div>
																						<div className="childThbBtn">
																							<p>THB</p>
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
																			<td scope="row">
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="ceateTransport">
																					<input type="text" />
																				</div>
																			</td>
																			<td>
																				<div className="thbFrieght ceateTransport">
																					<div className="parentthb">
																						<div className="childThb">
																							<input type="text" />
																						</div>
																						<div className="childThbBtn">
																							<p>THB</p>
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
												<Link className="btn btn-danger" to={"/transportNew"}>
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

export default AddTransport
