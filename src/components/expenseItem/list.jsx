import { useMemo ,useState,useEffect} from "react"
import { useQuery } from "react-query"
import axios from "axios";

import { Link, useNavigate } from "react-router-dom"
import { Card } from "../../card"
import { TableView } from "../table"
import { API_BASE_URL } from "../../Url/Url";

export const ExpenseItemList = () => {

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
				Header: "Name",
				accessor: "Name_EN",
			},
			{
				Header: "Type",
				accessor: "type_name_en",
			},
			{
				Header: "Chart of Account",
				accessor: "account_name",
			},
			{
				Header: "Actions",
				accessor: (a) => (
					<Link to="/expenseItemEdit" state={{ from: { ...a } }}>
						<i className="mdi mdi-pencil" />
					</Link>
				),
			},
		],
		[],
	)

	return (
		<Card
			title={"Expense Item Management"}
			endElement={
				<button
					type="button"
					onClick={() => navigate("/expenseItemEdit")}
					className="btn button btn-info"
				>
					Create
				</button>
			}
		>
			<TableView columns={columns} data={data} />
		</Card>
	)
}
