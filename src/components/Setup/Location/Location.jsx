import React from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"
import { Card } from "../../../card"
import { TableView } from "../../table"
import { useTranslation } from "react-i18next";

const Location = () => {
	const [t, i18n] = useTranslation("global");
	const navigate = useNavigate()
	const { data } = useQuery("getLocation")

	const columns = React.useMemo(
		() => [
			{
				Header: t("id"),
				id: "index",
				accessor: (_row, i) => i + 1,
			},
			{
				Header: t("name"),
				accessor: "name",
			},

			{
				Header: t("address"),
				accessor: "address",
			},

			{
				Header: t("gpsLocation"),
				accessor: "gps_location",
			},

			//   {
			//     Header: 'Status',
			//     accessor:  a => <div style={{marginTop:"-8px"}} ><BlueSwitch {...label}  defaultChecked /> </div>
			//   },
			{
				Header: t("actions"),
				accessor: (a) => (
					<Link to="/updateLocation" state={{ from: a }}>
						<i
							className="mdi mdi-pencil"
							style={{
								width: "20px",
								color: "#203764",
								fontSize: "22px",
								marginTop: "10px",
							}}
						/>
					</Link>
				),
			},
		],
		[t],
	)
	return (
		<Card
			title={t("locationManagement")}
			endElement={
				<button
					type="button"
					onClick={() => navigate("/createLocation")}
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

export default Location
