import axios from "axios"
import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { toast } from "react-toastify"

const UpdateHourly = () => {
	const location = useLocation()
	const { from } = location.state || {}
	const navigate = useNavigate()
	const [state, setState] = React.useState({
		user_id:localStorage.getItem("id"),
		wages_id: from?.wages_id,
		from_time:
			from?.from_time ||
			`${new Date().getHours().toString().padStart(2, "0")}:${new Date()
				.getMinutes()
				.toString()
				.padStart(2, "0")}:00`,
		to_time:
			from?.to_time ||
			`${new Date().toString().padStart(2, "0")}:${new Date()
				.toString()
				.padStart(2, "0")}:00`,
		shift_name_en: from?.shift_name_en,
		Monday: from?.Monday,
		Tuesday: from?.Tuesday,
		Wednesday: from?.Wednesday,
		Thursday: from?.Thursday,
		Friday: from?.Friday,
		Saturday: from?.Saturday,
		Sunday: from?.Sunday,
		wage: from?.wage,
	})
	const checkboxHandle = (event) => {
		const { name, checked } = event.target
		setState((prevState) => {
			return {
				...prevState,
				[name]: checked ? 1 : 0,
			}
		})
	}
	const handleChange = (event) => {
		const { name, value } = event.target

		setState((prevState) => {
			return {
				...prevState,
				[name]: value,
			}
		})
	}
	const update = () => {
		axios
			.post(
				`${API_BASE_URL}/${from?.wages_id ? "updateWage" : "addWage"}`,
				state,
			)
			.then((response) => {
				toast.success("Wage Added Successfully", {
					autoClose: 1000,
					theme: "colored",
				})
				navigate("/hourly")
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<Card
			title={`Wages Management / ${from?.wages_id ? "Update" : "Create"} Form`}
		>
			<div className="top-space-search-reslute">
				<div className="tab-content px-2 md:!px-4">
					<div className="tab-pane active" id="header" role="tabpanel">
						<div
							id="datatable_wrapper"
							className="information_dataTables dataTables_wrapper dt-bootstrap4"
						>
							<div className="formCreate">
								<form action="">
									<div className="row cratePurchase">
										<div className="col-lg-3 form-group">
											<h6>Shift Name</h6>
											<input
												type="text"
												name="shift_name_en"
												className="w-full"
												value={state.shift_name_en}
												onChange={handleChange}
											/>
										</div>
										<div className="col-lg-3 form-group">
											<h6>From Time</h6>
											<input
												type="time"
												name="from_time"
												className="w-full"
												value={state.from_time}
												onChange={handleChange}
											/>
										</div>
										<div className="col-lg-3 form-group">
											<h6>To Time</h6>
											<input
												type="time"
												name="to_time"
												className="w-full"
												value={state.to_time}
												onChange={handleChange}
											/>
										</div>
										<div className="col-lg-3 form-group">
											<h6>Wage</h6>
											<input
												type="number"
												name="wage"
												className="w-full"
												value={state.wage}
												onChange={handleChange}
											/>
										</div>
									</div>
									{[
										"Monday",
										"Tuesday",
										"Wednesday",
										"Thursday",
										"Friday",
										"Saturday",
										"Sunday",
									].map((day) => (
										<div className="flex gap-2 items-center">
											<label className="toggleSwitch large" onclick="">
												<input
													name={day}
													checked={state[day]}
													onChange={checkboxHandle}
													id={`${day}-sel`}
													type="checkbox"
												/>
												<span>
													<span>OFF</span>
													<span>ON</span>
												</span>
												<a></a>
											</label>
											<label htmlFor={`${day}-sel`}>{day}</label>
										</div>
									))}
								</form>
							</div>
						</div>
					</div>
					<div className="card-footer">
						<button
							className="btn btn-primary"
							type="submit"
							name="signup"
							onClick={update}
						>
							{from?.wages_id ? "Update" : "Create"}
						</button>
						<Link className="btn btn-danger" to={"/hourly"}>
							Cancel
						</Link>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default UpdateHourly
