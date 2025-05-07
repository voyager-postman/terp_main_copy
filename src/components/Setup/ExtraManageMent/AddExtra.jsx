import { Link } from "react-router-dom"

const AddExtra = () => {
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
													Extra Management / Create Form
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
															<div className="row justify-content-center">
																<div className="form-group col-lg-3">
																	<h6>Value</h6>
																	<input
																		type="text"
																		id="name_th"
																		name="name_th"
																		className="form-control"
																		placeholder="value"
																		value=""
																	/>
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
														Create
													</button>
													<Link className="btn btn-danger" to={"/extra"}>
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

export default AddExtra
