import Switch from "@mui/material/Switch"
import { blue } from "@mui/material/colors"
import { alpha, styled } from "@mui/material/styles"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { BiEdit } from "react-icons/bi"
import ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { useTable } from "react-table"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"

const UnitCountNew = () => {
	const [data, setData] = useState([])
	const [status, setStatus] = useState("on")
	const [pageNumber, setPageNumber] = useState(0)
	const usersPerPage = 10
	const pagesVisited = pageNumber * usersPerPage
	const pageCount = Math.ceil(data.length / usersPerPage)
	const label = { inputProps: { "aria-label": "Color switch demo" } }

	const BlueSwitch = styled(Switch)(({ theme }) => ({
		"& .MuiSwitch-switchBase.Mui-checked": {
			color: blue[900],
			"&:hover": {
				backgroundColor: alpha(blue[900], theme.palette.action.hoverOpacity),
			},
		},
		"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
			backgroundColor: blue[900],
		},
	}))

	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				id: "index",
				accessor: (_row, i) => i + 1,
			},

			{
				Header: "Name",
				accessor: "unit_name_en",
			},

			{
				Header: "Created",
				accessor: (a) => moment(a.created).format("DD-MM-YYYY"),
			},

			{
				Header: "Status",
				accessor: (a) => (
					<div style={{ marginTop: "-10px" }}>
						<BlueSwitch
							checked={a.status == "on" ? true : false}
							onClick={(checked) => {
								unitStatus(a.unit_id)
								setStatus(checked)
							}}
							{...label}
							value={a.status}
							defaultChecked
						/>
					</div>
				),
			},

			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/unit_edit" state={{ from: a }}>
						{" "}
						<BiEdit
							style={{ width: "20px", color: "#203764", fontSize: "20px" }}
						/>
					</Link>
				),
			},
		],
		[],
	)

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({
			columns,
			data,
		})

	const changePage = ({ selected }) => {
		setPageNumber(selected)
	}

	// Get Unit Data Api
	const getUnitData = () => {
		axios
			.get(`${API_BASE_URL}/getAllUnit`)
			.then((response) => {
				// console.log(response)
				setData(response.data.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		getUnitData()
	}, [])

	// Get Unit Data Api

	// Unit Status Update Api

	const unitStatus = (unit_id) => {
		axios
			.post(`${API_BASE_URL}/updateUnitStatus`, { unit_id: unit_id })
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					getUnitData()
					return
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<>
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
										Unit Count Management
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
														Unit Count Management
													</h6>
												</div>
												<div className="col-md-6">
													<div className="exportPopupBtn create_btn_style">
														<button className="btn button btn-info">
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
															{...getTableProps()}
															id="example"
															className="display table table-hover table-striped borderTerpProduce"
															style={{ width: "100%" }}
														>
															<thead>
																{headerGroups.map((headerGroup) => (
																	<tr {...headerGroup.getHeaderGroupProps()}>
																		{headerGroup.headers.map((column) => (
																			<th {...column.getHeaderProps()}>
																				{column.render("Header")}
																			</th>
																		))}
																	</tr>
																))}
															</thead>
															<tbody {...getTableBodyProps()}>
																{rows
																	.slice(
																		pagesVisited,
																		pagesVisited + usersPerPage,
																	)
																	.map((row) => {
																		prepareRow(row)
																		return (
																			<tr
																				className="rowCursorPointer"
																				data-bs-toggle="modal"
																				data-bs-target="#myModal"
																				{...row.getRowProps()}
																			>
																				{row.cells.map((cell) => {
																					return (
																						<td {...cell.getCellProps()}>
																							{cell.render("Cell")}
																						</td>
																					)
																				})}
																			</tr>
																		)
																	})}
															</tbody>
														</table>
														<div style={{ marginLeft: "100%" }}>
															<ReactPaginate
																previousLabel={"Previous"}
																nextLabel={"Next"}
																pageCount={pageCount}
																onPageChange={changePage}
																containerClassName={"paginationBttns"}
																previousLinkClassName={"previousBttn"}
																nextLinkClassName={"nextBttn"}
																disabledClassName={"paginationDisabled"}
																activeClassName={"paginationActive"}
															/>
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
				</div>
			</main>
		</>
	)
}

export default UnitCountNew
