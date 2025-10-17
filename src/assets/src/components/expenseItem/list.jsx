import { useMemo ,useState,useEffect} from "react"
import { useQuery } from "react-query"
import axios from "axios";

import { Link, useNavigate } from "react-router-dom"
import { Card } from "../../card"
import { TableView } from "../table"
import { API_BASE_URL } from "../../Url/Url";
 import { useTranslation } from "react-i18next";
export const ExpenseItemList = () => {
const [t, i18n] = useTranslation("global");
	const [data, setData] = useState([]);
	const getExpenseItem=()=>{
	  axios.get(`${API_BASE_URL}/getAllExpenseItems`).then((res) => {
		setData(res.data.data || []);
	  });
  
	}
	useEffect(() => {
	  getExpenseItem();
	}, []);
	const navigate = useNavigate()
	// const { data } = useQuery("getAllExpenseItems")
	const columns = useMemo(
		() => [
			{
			Header: t("name"),
				accessor: "Name_EN",
			},
			{
			  Header: t("type"),
				accessor: "type_name_en",
			},
			{
			   Header: t("chart_of_account"),
				accessor: "account_name",
			},
			{
				 Header: t("actions"),
				accessor: (a) => (
					<Link to="/expenseItemEdit" state={{ from: { ...a } }}>
						<i className="mdi mdi-pencil" />
					</Link>
				),
			},
		],
		[t],
	)

	return (
		<Card
			title={t("expense_item_management")}
			endElement={
				<button
					type="button"
					onClick={() => navigate("/expenseItemEdit")}
					className="btn button btn-info"
				>
					{t("create")}
				</button>
			}
		>
			<TableView columns={columns} data={data} />
		</Card>
	)
}
