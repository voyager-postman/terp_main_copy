import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"

const EditClient = () => {
	const location = useLocation()
	const { from } = location.state || {}
	const navigate = useNavigate()
	const defaultState = {
		client_name: from?.client_name || "",
		client_email: from?.client_email || "",
		client_tax_number: from?.client_tax_number || "",
		client_phone: from?.client_phone || "",
		client_address: from?.client_address || "",
		client_bank_name: from?.client_bank_name || "",
		client_bank_account: from?.client_bank_account || "",
		client_bank_number: from?.client_bank_number || "",
	}
	const [state, setState] = useState(defaultState)

	const handleChange = (event) => {
		const { name, value } = event.target
		setState((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	const AddClient = () => {
		const request = {
			client_id: from?.client_id || "",
			client_name: state.client_name,
			client_email: state.client_email,
			client_tax_number: state.client_tax_number,
			client_phone: state.client_phone,
			client_address: state.client_address,
			client_bank_name: state.client_bank_name,
			client_bank_account: state.client_bank_account,
			client_bank_number: state.client_bank_number,
		}

		const checkField =
			request.client_name == "" ||
			request.client_email == "" ||
			request.client_tax_number == "" ||
			request.client_phone == "" ||
			request.client_address == "" ||
			request.client_bank_name == "" ||
			request.client_bank_account == "" ||
			request.client_bank_number == ""
		if (checkField) {
			toast.warn("Please Fill All The Fields", {
				autoClose: 1000,
				theme: "colored",
			})
			return false
		}
		axios
			.post(`${API_BASE_URL}/updateClientData`, request)
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
					navigate("/client")
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
				console.log(error)
			})
	}

	//Add Client Api
	return (
		<>
			<div className="bg-gray-100 mx-4 my-10 shadow-md shadow-gray-700/40 hover:shadow-gray-900/40">
				<div
					style={{ borderBottom: "2px solid gray" }}
					className="flex justify-start px-4 uppercase py-4"
				>
					<p className="text-blue-600">Client Management</p>
					<span className="text-gray-800">/ Update Form</span>
				</div>

				<div className="grid grid-cols-2 gap-4 py-2 px-4">
					<div className="inputBox py-2 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Name
						</span>
						<input
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Name"
							value={state.client_name}
							name="client_name"
						/>
					</div>

					<div className="inputBox py-2 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Tax Number
						</span>
						<input
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Tax Number"
							value={state.client_tax_number}
							name="client_tax_number"
						/>
					</div>

					<div className="inputBox py-2 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Email
						</span>
						<input
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Email"
							value={state.client_email}
							name="client_email"
						/>
					</div>

					<div className="inputBox flex py-2 flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Phone Number
						</span>
						<input
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Phone Number"
							value={state.client_phone}
							name="client_phone"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 mx-4 my-4">
					<label
						htmlFor="message"
						className="block font-bold mb-2 text-sm font-bold text-gray-900 dark:text-white uppercase"
					>
						Address :
					</label>
					<textarea
						onChange={handleChange}
						value={state.client_address}
						name="client_address"
						id="message"
						rows="4"
						className="block p-1.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-blue-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Enter Your Address"
					/>
				</div>

				<label
					htmlFor="message"
					style={{ borderBottom: "2px solid gray", paddingBottom: "10px" }}
					className="block mx-4 font-bold mb-2 text-sm font-bold text-gray-900 dark:text-white uppercase"
				>
					Bank Information :
				</label>

				<div className="grid grid-cols-3 mx-4 my-4 gap-2">
					<div className="inputBox py-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Bank Name
						</span>
						<input
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Bank name"
							value={state.client_bank_name}
							name="client_bank_name"
						/>
					</div>

					<div className="inputBox py-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Account Name
						</span>
						<input
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Account Name"
							value={state.client_bank_account}
							name="client_bank_account"
						/>
					</div>

					<div className="inputBox py-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Account Number
						</span>
						<input
							onChange={handleChange}
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Account Number"
							value={state.client_bank_number}
							name="client_bank_number"
						/>
					</div>
				</div>

				<div className="flex justify-start gap-4 py-4 px-4 my-4">
					<Link
						onClick={AddClient}
						className="bg-primary text-white  px-6 py-2 rounded uppercase hover:bg-blue-500"
						type="submit"
					>
						Update
					</Link>
					<Link
						to="/client"
						className="bg-red-500 hover:bg-red-700 text-white  px-6 py-2 rounded uppercase "
						type="submit"
					>
						Cancel
					</Link>
				</div>
			</div>
		</>
	)
}

export default EditClient
