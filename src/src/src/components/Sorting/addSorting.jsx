import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"
import { Card } from "../../card"

const NewSorting = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { from } = location.state || {}

	const defaultState = {
		receiving_id: from?.receiving_id,
		sorting_good: from?.qty_to_sort,
		sorted_crates: from?.cartes_to_sort,
		sorting_notes: "",
		blue_crates: "",
		user_id:localStorage.getItem("id")
	}

	const [state, setState] = useState(defaultState)
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)

	const handleChange = (event) => {
		const { name, value } = event.target
		setState((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const addBank = () => {
		if (isButtonDisabled) return;
		setIsButtonDisabled(true);

		axios
			.post(`${API_BASE_URL}/addsorting`, state)
			.then((response) => {
				console.log(response, "Check response")
				toast.success("Sorting Added Successfully", {
					autoClose: 1000,
					theme: "colored",
				})
				navigate("/sorting")
			})
			.catch((error) => {
				console.log(error)
			})
	}
	
	return (
		<Card title="Operation / New sorting">
			<div className="top-space-search-reslute">
				<div className="tab-content px-2 md:!px-4">
					<div className="tab-pane active" id="header" role="tabpanel">
						<div
							id="datatable_wrapper"
							className="information_dataTables dataTables_wrapper dt-bootstrap4"
						>
							<div className="formCreate">
								<div className="row">
									<div className="form-group col-lg-3">
										<h6>POD Code</h6>
										<input
											type="text"
											className="form-control border-0"
											readOnly
											value={from.pod_code}
										/>
									</div>
									<div className="form-group col-lg-3">
										<h6>Name</h6>
										<input
											type="text"
											className="form-control border-0"
											readOnly
											value={from.produce}
										/>
									</div>
									<div className="form-group col-lg-3">
										<h6>Unit</h6>
										<input
											type="text"
											className="form-control border-0"
											readOnly
											value={from.Unit}
										/>
									</div>
								</div>
								<form action="">
									<div className="row">
										<div className="form-group col-lg-3">
											<h6>Sorting good</h6>
											<input
												onChange={handleChange}
												type="number"
												name="sorting_good"
												className="form-control"
												value={state.sorting_good}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>Sorted crate</h6>
											<input
												onChange={handleChange}
												type="number"
												name="sorted_crates"
												className="form-control"
												value={state.sorted_crates}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>Blue crates</h6>
											<input
												onChange={handleChange}
												type="text"
												name="blue_crates"
												className="form-control"
												value={state.blue_crates}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>Sorting Note</h6>
											<input
												onChange={handleChange}
												type="text"
												name="sorting_notes"
												className="form-control"
												value={state.sorting_notes}
											/>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="card-footer">
						<button
							onClick={addBank}
							disabled={isButtonDisabled}
							className="btn btn-primary"
							type="submit"
							name="signup"
						>
							Accept
						</button>
						<Link className="btn btn-danger" to="/sorting">
							Cancel
						</Link>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default NewSorting
