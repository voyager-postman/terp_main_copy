import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
// import Navbar from '../../Navbar/Navbar';

const UnitCreate = () => {
	const navigate = useNavigate()
	const defaultState = {
		unit_name_en: "",
		unit_name_th: "",
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

	//Create Unit Api

	const createUnit = async () => {
		const request = {
			unit_name_en: state.unit_name_en,
			unit_name_th: state.unit_name_th,
		}

		const fieldCheck = request.unit_name_en == "" || request.unit_name_th == ""
		if (fieldCheck) {
			toast.warn("Please Fill All The Fields", {
				autoClose: 1000,
				theme: "colored",
			})
			return false
		} else {
			await axios
				.post(`${API_BASE_URL}/createUnit`, request)
				.then((response) => {
					// console.log(response, "check response")
					if (response.data.success == true) {
						toast.success(response.data.message, {
							autoClose: 1000,
							theme: "colored",
						})
						navigate("/unitCount")
						return true
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
					if (error) {
						toast.error("Network Error", {
							autoClose: 1000,
							theme: "colored",
						})
						return
					}
				})
		}
	}

	//Create Unit Api

	return (
		<>
			{/* <Navbar/> */}
			<div className="bg-gray-100 mx-4 my-20 shadow-md shadow-gray-700/40 hover:shadow-gray-900/40">
				<div
					style={{ borderBottom: "2px solid gray" }}
					className="flex justify-start px-4 uppercase py-4"
				>
					<p className="text-blue-600">Unit Count Management</p>
					<span className="text-gray-800">/ Create Form</span>
				</div>

				<div
					className="flex grid grid-cols-2 gap-4 py-4 px-4"
					style={{ borderBottom: "2px solid gray" }}
				>
					<div className="inputBox py-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Name TH
						</span>
						<input
							onChange={handleChange}
							name="unit_name_th"
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Name Th"
						/>

						<i></i>
					</div>

					<div className="inputBox py-4 mb-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Name En
						</span>
						<input
							onChange={handleChange}
							name="unit_name_en"
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Name En"
						/>

						<i></i>
					</div>
				</div>

				<div className="flex justify-start gap-4 py-4 px-4 my-4">
					<Link
						onClick={createUnit}
						className="bg-primary text-white  px-6 py-2 rounded uppercase hover:bg-blue-500"
						type="submit"
					>
						Create
					</Link>
					<Link
						to="/unit_count"
						className="bg-red-500 hover:bg-red-700 text-white  px-6 py-2 rounded uppercase"
						type="submit"
					>
						Cancel
					</Link>
				</div>
			</div>
		</>
	)
}

export default UnitCreate
