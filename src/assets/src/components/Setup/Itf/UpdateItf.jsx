import { Link } from "react-router-dom"

const UpdateItf = () => {
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
													ITF Management / Update Form
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
													<div className="formCreate ">
														<form action="">
															<div className="row formEan">
																<div className="col-lg-3 form-group">
																	<h6>EAN Code</h6>
																	<input type="text" placeholder="ean code" />
																</div>

																<div className="col-lg-3 form-group">
																	<h6>Product Name</h6>
																	<input
																		type="text"
																		placeholder="product name"
																	/>
																</div>
															</div>
															<div className="row">
																<div className="addBtnEan">
																	<p>
																		{" "}
																		<strong style={{ color: "black" }}>
																			EAN net weight :
																		</strong>{" "}
																		<span> 80.55kg</span>
																	</p>
																	<button className="mt-0 mb-5">
																		Calculate
																	</button>
																</div>
															</div>
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
																			<th>Type</th>
																			<th>Name</th>
																			<th className="w-5">Quantity</th>
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
																			<td scope="row">
																				<div
																					className="ceateTransport"
																					style={{ width: "280px" }}
																				>
																					<select name="" id="">
																						<option value="">
																							Select type
																						</option>
																						<option value="">Produce </option>
																						<option value="">Packaging </option>
																					</select>
																				</div>
																			</td>
																			<td>
																				<div
																					className="ceateTransport"
																					style={{ width: "280px" }}
																				>
																					<select name="" id="">
																						<option value="">EAN</option>
																						<option value=""> Packaging</option>
																						<option value=""> Boxes</option>
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
																					<i className="mdi mdi-trash-can-outline"></i>
																				</a>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
															<div className="addBtnEan">
																<button>Add</button>
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
													Update
												</button>
												<Link className="btn btn-danger" to={"/itfNew"}>
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

export default UpdateItf
