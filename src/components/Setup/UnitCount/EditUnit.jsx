import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
// import Navbar from '../../Navbar/Navbar';

const EditUnit = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { from } = location.state || {}

	const defaultState = {
		unit_name_en: from && from?.unit_name_en,
		unit_name_th: from && from?.unit_name_th,
	}

	const [editUnitData, setEditUnitData] = useState(defaultState)

	const handleChange = (event) => {
		const { name, value } = event.target
		setEditUnitData((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}

	//Edit Unit Api

	const UpdateUnitData = async () => {
		const request = {
			unit_id: from && from?.unit_id,
			unit_name_en: editUnitData.unit_name_en,
			unit_name_th: editUnitData.unit_name_th,
		}

		await axios.post(`${API_BASE_URL}/updateUnit`, request).then((response) => {
			if (response.data.success == true) {
				toast.success(response.data.message, {
					autoClose: 1000,
					theme: "colored",
				})
				navigate("/unit_count")
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
	}

	// Edit Unit APi
	return (
		<>
			{/* <Navbar/> */}
			<div className="bg-gray-100 mx-4 my-20 shadow-md shadow-gray-700/40 hover:shadow-gray-900/40">
				<div
					style={{ borderBottom: "2px solid gray" }}
					className="flex justify-start px-4 uppercase py-4"
				>
					<p className="text-blue-600">Unit Count Management</p>
					<span className="text-gray-800">/ Update Form</span>
				</div>

				<div
					className="flex grid grid-cols-2 gap-4 py-4 px-4"
					style={{ borderBottom: "2px solid gray" }}
				>
					<div className="inputBox py-4 my-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Name TH
						</span>
						<input
							onChange={handleChange}
							defaultValue={from && from?.unit_name_th}
							name="unit_name_th"
							className="py-2 px-2 border-2 border-blue-900 rounded"
							type="text"
							placeholder="Name Th"
						/>

						<i></i>
					</div>

					<div className="inputBox py-4 my-4 flex flex-col">
						<span className="uppercase font-medium flex justify-start pb-2">
							Name En
						</span>
						<input
							onChange={handleChange}
							defaultValue={from && from?.unit_name_en}
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
						onClick={UpdateUnitData}
						className="bg-primary hover:bg-blue-500 text-white  px-6 py-2 rounded uppercase"
					>
						Update
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

export default EditUnit
