import BuyerProfilePieChart from "../components/Dashboard/BuyerProfilePieChart"
import DashboardStatsGrid from "../components/Dashboard/DashboardStatsGrid"
import PopularProducts from "../components/Dashboard/PopularProducts"
import RecentOrders from "../components/Dashboard/RecentOrders"
import TransactionChart from "../components/Dashboard/TransactionChart"

export default function Dashboard() {
	return (
		<>
			{/* <Navbar/> */}
			<div className="flex flex-col gap-4 px-4 py-4">
				<DashboardStatsGrid />
				{/* <div className="flex flex-row gap-4 w-full">
				<TransactionChart  />
				<BuyerProfilePieChart />
			</div> */}
				<div className="flex flex-row gap-4 w-full">
					<RecentOrders />
					<PopularProducts />
				</div>
				<div className="flex flex-row gap-4 w-full">
					<TransactionChart />
					<BuyerProfilePieChart />
				</div>
			</div>
		</>
	)
}
