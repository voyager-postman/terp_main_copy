import Switch from "@mui/material/Switch"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { BiEdit } from "react-icons/bi"
import ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { useTable } from "react-table"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"

const Client = () => {
	const [data, setData] = useState([])
	const [pageNumber, setPageNumber] = useState(0)
	const usersPerPage = 5
	const pagesVisited = pageNumber * usersPerPage
	const pageCount = Math.ceil(data.length / usersPerPage)
	const label = { inputProps: { "aria-label": "Color switch demo" } }

	const columns = React.useMemo(
		() => [
			{
				Header: "Id",
				id: "index",
				accessor: (_row, i) => i + 1,
			},

			{
				Header: "Name / Company",
				accessor: "client_name",
			},

			{
				Header: "Email",
				accessor: "client_email",
			},

			{
				Header: "Status",
				accessor: (a) => <Switch {...label} defaultChecked />,
			},
			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/edit_client" state={{ from: a }}>
						<BiEdit
							style={{
								width: "20px",
								margin: "0 auto",
								color: "blue",
								fontSize: "20px",
							}}
						/>
					</Link>
				),
			},
		],
		[],
	)

	// Get Airport Api

	const getAirportData = () => {
		axios
			.get(`${API_BASE_URL}/getAllClients`)
			.then((response) => {
				if (response.data.success == true) {
					setData(response.data.data)
				}
			})
			.catch((error) => {
				console.log(error)
				if (error) {
					toast.error("Network Error", {
						autoClose: 1000,
						theme: "colored",
					})
					return false
				}
			})
	}

	useEffect(() => {
		getAirportData()
	}, [])

	// Get Airport Api

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({
			columns,
			data,
		})

	const changePage = ({ selected }) => {
		setPageNumber(selected)
	}
	return (
		<div>
			<div className="bg-gray-100 mx-4 my-4 shadow-md shadow-gray-700/40 hover:shadow-gray-900/40">
				<div
					style={{ marginTop: "40px", borderBottom: "2px solid gray" }}
					className="flex justify-between px-20 py-4 "
				>
					<p className="font-bold uppercase hover-underline-animationn">
						Client ManageMent
					</p>

					<div className="table-data-search-box-manage ml-96">
						<div className="search-bar">
							<input
								type="text"
								className="searchTerm-input"
								placeholder=" Search..."
							/>
							<button
								type="submit"
								className="searchButtons font-medium pr-2 hover:bg-blue-500"
							>
								Search
							</button>
						</div>
					</div>

					<Link
						to="/add_client"
						className="bg-primary uppercase font-medium text-white  px-6 py-2 rounded hover:bg-blue-500"
					>
						Create
					</Link>
				</div>
				<table
					id="customers"
					{...getTableProps()}
					className="tblll"
					style={{ marginBottom: "2%" }}
				>
					<thead className="bg-gray-200 uppercase">
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th
										{...column.getHeaderProps()}
										className="border-b-2 border-gray-500 p-2 text-center tableFont"
									>
										{column.render("Header")}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows
							.slice(pagesVisited, pagesVisited + usersPerPage)
							.map((row) => {
								prepareRow(row)
								return (
									<tr {...row.getRowProps()}>
										{row.cells.map((cell) => {
											return (
												<td
													{...cell.getCellProps()}
													className="border-b-2 border-blue-500 p-2 text-gray-900 tableFont"
												>
													{cell.render("Cell")}
												</td>
											)
										})}
									</tr>
								)
							})}
					</tbody>
				</table>
				<div>
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
	)
}

export default Client
