import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
// import Navbar from '../../Navbar/Navbar';

const CreateClearance = () => {
	const defaultState = {
		vendor_id: "",
		custom_clearance_charges: "",
		phyto_charges: "",
		co_chamber_charges: "",
		extra_charges: "",
	}
	const [vendorList, setVendorList] = useState([])
	const [state, setState] = useState(defaultState)
	const navigate = useNavigate()

	const handleChange = (event) => {
		const { name, value } = event.target
		setState((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	//Get Vendor List Api

	const getVendorLists = () => {
		axios
			.get(`${API_BASE_URL}/getVendorList`)
			.then((response) => {
				setVendorList(response.data.vendorList)
			})
			.catch((error) => {
				console.log(error)
				if (error) {
					toast.error("Network Error", {
						autoClose: 1000,
						theme: "colored",
					})
					return
				}
			})
	}

	useEffect(() => {
		getVendorLists()
	}, [])

	//Get Vendor List Api

	//Add Clearance Api
	const addClearnace = async () => {
		const request = {
			vendor_id: state.vendor_id,
			from_port: 4,
			custom_clearance_charges: state.custom_clearance_charges,
			phyto_charges: state.phyto_charges,
			co_chamber_charges: state.co_chamber_charges,
			extra_charges: state.extra_charges,
		}

		const checkField =
			request.custom_clearance_charges == "" ||
			request.phyto_charges == "" ||
			request.co_chamber_charges == "" ||
			request.extra_charges == ""
		if (checkField) {
			toast.warn("Please Fill All The Fields", {
				autoClose: 1000,
				theme: "colored",
			})
			return false
		} else {
			await axios
				.post(`${API_BASE_URL}/addClearance`, request)
				.then((response) => {
					if (response.data.success == true) {
						toast.success(response.data.message, {
							autoClose: 1000,
							theme: "colored",
						})
						navigate("/clearance")
						return
					}

					if (response.data.success == false) {
						toast.error(response.data.message, {
							autoClose: 1000,
							theme: "colored",
						})
						return false
					}
				})
				.catch((error) => {
					if (error) {
						toast.error("Network Error", {
							autoClose: 1000,
							theme: "colored",
						})
						return false
					}
				})
		}
	}
	//Add Clearance Api

	return (
		<>
			{/* <Navbar/> */}
			<div className="bg-gray-100 mx-4 my-20 shadow-md shadow-gray-700/40 hover:shadow-gray-900/40">
				<div
					style={{ borderBottom: "2px solid gray" }}
					className="flex justify-start px-4 uppercase py-4"
				>
					<p className="text-blue-600">Clearance Management</p>
					<span className="text-gray-800">/ Create Form</span>
				</div>

				<div className="grid grid-cols-3 px-4 py-4">
					<div>
						<label
							htmlFor="vendors"
							className="block mb-2 uppercase font-medium flex justify-start  text-sm font-medium text-gray-900 dark:text-white"
						>
							Vendor
						</label>
						<select
							name="vendor_id"
							onChange={handleChange}
							id="vendors"
							className="bg-gray-50 border-2 border-blue-900 font-medium text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						>
							<option selected>Choose Vendor</option>
							{vendorList.map((vendor) => (
								<option value={vendor.vendor_id}>{vendor.name}</option>
							))}
						</select>
					</div>
				</div>

				<div
					className="flex grid grid-cols-2 gap-4 py-4 px-4"
					style={{ borderBottom: "2px solid gray" }}
				>
					<div className="inputBox py-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Total Clearance Charge
						</span>
						<input
							onChange={handleChange}
							name="custom_clearance_charges"
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Price"
						/>

						<i></i>
					</div>

					<div className="inputBox py-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Certificates
						</span>
						<input
							name="phyto_charges"
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Price"
						/>

						<i></i>
					</div>

					<div className="inputBox py-4 mb-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Chamber Of Commerce
						</span>
						<input
							onChange={handleChange}
							name="co_chamber_charges"
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Price"
						/>

						<i></i>
					</div>

					<div className="inputBox py-4 mb-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Extras
						</span>
						<input
							onChange={handleChange}
							name="extra_charges"
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Price"
						/>

						<i></i>
					</div>
				</div>

				<div className="flex justify-start gap-4 py-4 px-4 my-4">
					<Link
						onClick={addClearnace}
						className="bg-primary hover:bg-blue-500 text-white  px-6 py-2 rounded uppercase"
					>
						Create
					</Link>
					<Link
						to="/clearance"
						className="bg-red-500 hover:bg-red-700 text-white  px-6 py-2 rounded uppercase"
					>
						Cancel
					</Link>
				</div>
			</div>
		</>
	)
}

export default CreateClearance
