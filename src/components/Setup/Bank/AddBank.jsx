import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"

const AddBank = () => {
	const navigate = useNavigate()
	const defaultState = {
		Bank_nick_name: "",
		bank_name: "",
		bank_account_number: "",
		Account_Name: "",
		Currency: "",
		Bank_Address: "",
		Swift: "",
		IBAN: "",
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

	const addBank = () => {
		const request = {
			user_id:localStorage.getItem("id"),
			Bank_nick_name: state.Bank_nick_name,
			bank_name: state.bank_name,
			bank_account_number: state.bank_account_number,
			Account_Name: state.Account_Name,
			Currency: state.Currency,
			Bank_Address: state.Bank_Address,
			Swift: state.Swift,
			IBAN: state.IBAN,
		}

		axios
			.post(`${API_BASE_URL}/addBank`, request)
			.then((response) => {
				console.log(response, "Check responseee")
				if (response.data.success == true) {
					toast.success("Bank Added Successfully", {
						autoClose: 1000,
						theme: "colored",
					})
					navigate("/bankNew")
					return
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<Card title="Bank / Create Form">
			<div className="top-space-search-reslute">
				<div className="tab-content px-2 md:!px-4">
					<div className="tab-pane active" id="header" role="tabpanel">
						<div
							id="datatable_wrapper"
							className="information_dataTables dataTables_wrapper dt-bootstrap4"
						>
							<div className="formCreate">
								<form action="">
									<div className="row">
										<div className="form-group col-lg-3">
											<h6>Bank Name</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_th"
												name="bank_name"
												className="form-control"
												placeholder="Bank Name"
												value={state.bank_name}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>Bank Nick Name</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Bank_nick_name"
												className="form-control"
												placeholder="Bank Nick Name"
												value={state.bank_nick_name}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>Account Number</h6>
											<input
												onChange={handleChange}
												type="text"
												id="hs_name"
												name="bank_account_number"
												className="form-control"
												placeholder="Account Number"
												value={state.bank_account_number}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>Account Name</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Account_Name"
												className="form-control"
												placeholder="Account Name"
												value={state.Account_Name}
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group col-lg-3">
											<h6>Currency</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Currency"
												className="form-control"
												placeholder="Currency"
												value={state.Currency}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>Bank Address</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Bank_Address"
												className="form-control"
												placeholder="Bank Address"
												value={state.Bank_Address}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>IBAN</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="IBAN"
												className="form-control"
												placeholder="IBAN"
												value={state.IBAN}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>Swift</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Swift"
												className="form-control"
												placeholder="Swift"
												value={state.Swift}
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
							className="btn btn-primary"
							type="submit"
							name="signup"
						>
							Create
						</button>
						<Link className="btn btn-danger" to="/bankNew">
							Cancel
						</Link>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default AddBank
