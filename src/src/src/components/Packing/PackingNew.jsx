import { useNavigate } from "react-router-dom"

const PackingNew = () => {
	const navigate = useNavigate()
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
									Packing
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
													{" "}
													Packing Management
												</h6>
											</div>
											<div className="col-md-6">
												<div className="exportPopupBtn create_btn_style">
													<button
														onClick={() => navigate("/add_packing")}
														className="btn button btn-info"
													>
														Create
													</button>
												</div>
											</div>
										</div>
									</div>

									<div className="top-space-search-reslute">
										<div className="tab-content px-2 md:!px-4">
											<div className="parentProduceSearch">
												<div className="entries">
													<small> show</small>{" "}
													<select>
														<option value="10">10</option>
														<option value="25">25</option>
														<option value="50">50</option>
														<option value="100">100</option>
													</select>{" "}
													<small>entries</small>
												</div>
												<div>
													<input type="search" placeholder="search" />
												</div>
											</div>
											<div
												className="tab-pane active"
												id="header"
												role="tabpanel"
											>
												<div
													id="datatable_wrapper"
													className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
												>
													<div className="d-flex exportPopupBtn"></div>
													<table
														id="example"
														className="display table table-hover table-striped borderTerpProduce"
														style={{ width: "100%" }}
													>
														<thead>
															<tr>
																<th className="text-center">Code</th>
																<th className="text-center">EAN</th>
																<th className="text-center">Name</th>
																<th className="text-center">Quantity</th>
																<th className="text-center">Unit</th>
																<th className="text-center">Price/Unit</th>
																<th className="text-center">AVG Weight</th>
																<th className="text-center">Wastage</th>
																<th className="text-center">Packing Date</th>
																<th className="text-center">Action</th>
															</tr>
														</thead>
														<tbody>
															<tr
																className="rowCursorPointer"
																data-bs-toggle="modal"
																data-bs-target="#myModal"
															>
																<td className="text-center" scope="row">
																	PO20230935101
																</td>
																<td className="text-center"></td>
																<td className="text-center">ms access </td>
																<td className="text-center">16.00</td>
																<td className="text-center">กก / KG</td>
																<td className="text-center">23.779</td>
																<td className="text-center">1000</td>
																<td className="text-center">7.2%</td>
																<td className="text-center">30-Sep-2023</td>

																<td className="editIcon">
																	<i className="mdi mdi-pencil"></i>
																	<i className="ps-2 mdi mdi-delete"></i>
																	<i className=" ps-2 mdi mdi-arrow-left-bottom"></i>
																</td>
															</tr>
															<tr
																className="rowCursorPointer"
																data-bs-toggle="modal"
																data-bs-target="#myModal"
															>
																<td className="text-center" scope="row">
																	PO20230935101
																</td>
																<td className="text-center"></td>
																<td className="text-center">ms access </td>
																<td className="text-center">16.00</td>
																<td className="text-center">กก / KG</td>
																<td className="text-center">23.779</td>
																<td className="text-center">1000</td>
																<td className="text-center">7.2%</td>
																<td className="text-center">30-Sep-2023</td>

																<td className="editIcon">
																	<i className="mdi mdi-pencil"></i>
																	<i className="ps-2 mdi mdi-delete"></i>
																	<i className=" ps-2 mdi mdi-arrow-left-bottom"></i>
																</td>
															</tr>
															<tr
																className="rowCursorPointer"
																data-bs-toggle="modal"
																data-bs-target="#myModal"
															>
																<td className="text-center" scope="row">
																	PO20230935101
																</td>
																<td className="text-center"></td>
																<td className="text-center">ms access </td>
																<td className="text-center">16.00</td>
																<td className="text-center">กก / KG</td>
																<td className="text-center">23.779</td>
																<td className="text-center">1000</td>
																<td className="text-center">7.2%</td>
																<td className="text-center">30-Sep-2023</td>
																<td className="editIcon">
																	<i className="mdi mdi-pencil"></i>
																	<i className="ps-2 mdi mdi-delete"></i>
																	<i className=" ps-2 mdi mdi-arrow-left-bottom"></i>
																</td>
															</tr>
															<tr
																className="rowCursorPointer"
																data-bs-toggle="modal"
																data-bs-target="#myModal"
															>
																<td className="text-center" scope="row">
																	PO20230935101
																</td>
																<td className="text-center"></td>
																<td className="text-center">ms access </td>
																<td className="text-center">16.00</td>
																<td className="text-center">กก / KG</td>
																<td className="text-center">23.779</td>
																<td className="text-center">1000</td>
																<td className="text-center">7.2%</td>
																<td className="text-center">30-Sep-2023</td>
																<td className="editIcon">
																	<i className="mdi mdi-pencil"></i>
																	<i className="ps-2 mdi mdi-delete"></i>
																	<i className=" ps-2 mdi mdi-arrow-left-bottom"></i>
																</td>
															</tr>
														</tbody>
													</table>
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

export default PackingNew
