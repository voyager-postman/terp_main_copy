import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../../Url/Url"
import { Card } from "../../../card"
import { useTranslation } from "react-i18next";

const UpdateBank = () => {
	  const { t } = useTranslation("global");
	const location = useLocation()
	const navigate = useNavigate()
	const { from } = location.state || {}

	const defaultState = {
		bank_name: from?.bank_name || "",
		bank_account_number: from?.bank_account_number || "",
		Bank_nick_name: from?.Bank_nick_name || "",
		Bank_Address: from?.Bank_Address || "",
		Account_Name: from?.Account_Name || "",
		Currency: from?.Currency || "",
		IBAN: from?.IBAN || "",
		Swift: from?.Swift || "",
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

	const updateBank = () => {
		const request = {
			bank_id: from?.bank_id,
			bank_name: state.bank_name,
			bank_account_number: state.bank_account_number,
			Bank_nick_name: state.Bank_nick_name,
			Bank_Address: state.Bank_Address,
			Account_Name: state.Account_Name,
			Currency: state.Currency,
			IBAN: state.IBAN,
			Swift: state.Swift,
		}

		axios
			.post(`${API_BASE_URL}/updateBank`, request)
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
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
		<Card title={t("bankUpdateForm")}>
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
											<h6>{t("bankName")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_th"
												name="bank_name"
												className="form-control"
												placeholder={t("bankName")}
												defaultValue={state.bank_name}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>{t("bankNickname")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Bank_nick_name"
												className="form-control"
												placeholder={t("bankNickname")}
												defaultValue={state.Bank_nick_name}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>{t("accountNumber")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="hs_name"
												name="bank_account_number"
												className="form-control"
												placeholder={t("accountNumber")}
												defaultValue={state.bank_account_number}
											/>
										</div>
										<div className="form-group col-lg-3">
											<h6>{t("accountName")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Account_Name"
												className="form-control"
												placeholder={t("accountName")}
												defaultValue={state.Account_Name}
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group col-lg-3">
											<h6>{t("currency")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Currency"
												className="form-control"
												placeholder={t("currency")}
												defaultValue={state.Currency}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>{t("bankAddress")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Bank_Address"
												className="form-control"
												placeholder={t("bankAddress")}
												defaultValue={state.Bank_Address}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>{t("iban")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="IBAN"
												className="form-control"
												placeholder={t("iban")}
												defaultValue={state.IBAN}
											/>
										</div>

										<div className="form-group col-lg-3">
											<h6>{t("swift")}</h6>
											<input
												onChange={handleChange}
												type="text"
												id="name_en"
												name="Swift"
												className="form-control"
												placeholder={t("swift")}
												defaultValue={state.Swift}
											/>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="card-footer">
						<button
							onClick={updateBank}
							className="btn btn-primary"
							type="submit"
							name="signup"
						>
							{t("update")}
						</button>
						<Link className="btn btn-danger " to="/bankNew">
							{t("cancel")}
						</Link>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default UpdateBank
