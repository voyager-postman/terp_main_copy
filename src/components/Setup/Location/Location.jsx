import React from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"
import { Card } from "../../../card"
import { TableView } from "../../table"

const Location = () => {
	const navigate = useNavigate()
	const { data } = useQuery("getLocation")

	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				id: "index",
				accessor: (_row, i) => i + 1,
			},
			{
				Header: "Name",
				accessor: "name",
			},

			{
				Header: "Address",
				accessor: "address",
			},

			{
				Header: "Gps Location",
				accessor: "gps_location",
			},

			//   {
			//     Header: 'Status',
			//     accessor:  a => <div style={{marginTop:"-8px"}} ><BlueSwitch {...label}  defaultChecked /> </div>
			//   },
			{
				Header: "Actions",
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
		[],
	)
	return (
		<Card
			title={"Location Management"}
			endElement={
				<button
					type="button"
					onClick={() => navigate("/createLocation")}
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

export default Location
