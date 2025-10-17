import axios from "axios"
import React, { useEffect, useState } from "react"
import { AiFillEye } from "react-icons/ai"
import ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { useTable } from "react-table"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"

const Hpl = () => {
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
				Header: "Code",
				accessor: (a) => "PO20230935101",
			},
			{
				Header: "Ean",
				accessor: (a) => "BARB01",
			},
			{
				Header: "name",
				accessor: "port_country",
			},
			{
				Header: "Quantity",
				accessor: (a) => "108.00",
			},
			{
				Header: "Unit",
				accessor: (a) => "กก / KG",
			},
			{
				Header: "Price/Unit",
				accessor: (a) => "23.779",
			},
			{
				Header: "Avg Weight",
				accessor: (a) => "	1000",
			},
			{
				Header: "Wastage",
				accessor: (a) => "7.2%",
			},
			{
				Header: "Packing Date",
				accessor: (a) => "30-Sep-2023",
			},

			{
				Header: "Actions",
				accessor: (a) => (
					<span>
						<Link to="/update_bank" state={{ from: a }}>
							<AiFillEye
								style={{
									width: "20px",
									margin: "0 auto",
									color: "blue",
									fontSize: "20px",
								}}
							/>
						</Link>
					</span>
				),
			},
		],
		[],
	)

	// Get Airport Api

	const getAirportData = () => {
		axios
			.get(`${API_BASE_URL}/getAllAirports`)
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
						Hpl ManageMent
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
						to="/add_bank"
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

export default Hpl
